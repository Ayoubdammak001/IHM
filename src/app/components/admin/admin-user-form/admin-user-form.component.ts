import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Role } from '../../../models/enums';

@Component({
  selector: 'app-admin-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-user-form.component.html',
  styleUrls: ['./admin-user-form.component.scss']
})
export class AdminUserFormComponent implements OnInit {
  userForm: FormGroup;
  userId: number | null = null;
  loading = false;
  error = '';
  isEdit = false;
  roles = Object.values(Role);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(6)]],
      role: ['CLIENT', Validators.required],
      phone: [''],
      address: [''],
      description: [''],
      status: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = id !== 'new';

    if (this.isEdit && id) {
      this.userId = +id;
      this.loadUser(this.userId);
    }

    if (this.isEdit) {
      this.userForm.get('password')?.setValidators([]); // Remove validators for edit mode
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  private loadUser(id: number): void {
    this.loading = true;
    this.userService.getById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          role: user.role,
          phone: user.phone,
          address: user.address,
          description: user.description,
          status: user.status
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error loading user: ' + err.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.loading = true;
    this.error = '';

    // If password is empty in edit mode, remove it from the form value
    const userData = {...this.userForm.value};
    if (this.isEdit && !userData.password) {
      delete userData.password;
    }

    if (this.isEdit && this.userId) {
      this.userService.update(this.userId, userData).subscribe({
        next: () => {
          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          this.error = 'Error updating user: ' + err.message;
          this.loading = false;
        }
      });
    } else {
      this.userService.add(userData).subscribe({
        next: () => {
          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          this.error = 'Error creating user: ' + err.message;
          this.loading = false;
        }
      });
    }
  }
} 
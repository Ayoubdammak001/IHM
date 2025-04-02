import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-provider-profile',
  templateUrl: './provider-profile.component.html',
  styleUrls: ['./provider-profile.component.scss']
})
export class ProviderProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  submitting = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.loading = true;
      this.userService.getById(currentUser.id).subscribe({
        next: (user) => {
          this.profileForm.patchValue({
            username: user.username,
            email: user.email,
            phone: user.phone,
            address: user.address,
            description: user.description
          });
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error loading profile: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = false;

    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        ...this.profileForm.value
      };

      this.userService.update(currentUser.id, updatedUser).subscribe({
        next: () => {
          this.success = true;
          this.submitting = false;
          setTimeout(() => this.success = false, 3000);
        },
        error: (err) => {
          this.error = 'Error updating profile: ' + err.message;
          this.submitting = false;
        }
      });
    }
  }
} 
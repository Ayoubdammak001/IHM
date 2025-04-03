import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UserService } from '../../services/user.service';
import { Role, Gender } from '../../models/enums';

@Component({
  selector: 'app-register',
  standalone: true, // ✅ composant autonome
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    CommonModule,          // ✅ *ngIf, *ngFor, ngClass...
    ReactiveFormsModule,   // ✅ [formGroup], [formControlName]...
    RouterModule           // ✅ routerLink dans le template
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';
  roles = Object.values(Role);
  genders = Object.values(Gender);

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      role: ['CLIENT', Validators.required],
      gender: ['MALE', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = '';

    const userData = {
      ...this.registerForm.value,
      active: true
    };

    this.userService.add(userData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Error during registration. Please try again.';
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss']
})
export class ClientProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  loading = true;
  error = '';
  success = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.error = 'Unable to load user profile';
      this.loading = false;
      return;
    }

    this.profileForm.patchValue({
      username: this.currentUser.username,
      email: this.currentUser.email,
      phone: this.currentUser.phone,
      address: this.currentUser.address
    });

    this.loading = false;
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = false;

    const updatedUser = {
      ...this.currentUser,
      ...this.profileForm.value
    };

    // Simuler un update
    setTimeout(() => {
      this.success = true;
      this.loading = false;
    }, 1000);
  }
}

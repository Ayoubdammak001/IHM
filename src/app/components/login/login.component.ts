import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.loading = false;
        // Rediriger vers le tableau de bord approprié selon le rôle
        switch (user.role) {
          case 'CLIENT':
            this.router.navigate(['/client/dashboard']);
            break;
          case 'PROVIDER':
            this.router.navigate(['/provider/dashboard']);
            break;
          case 'ADMIN':
            this.router.navigate(['/admin/dashboard']);
            break;
          default:
            this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Invalid email or password';
      }
    });
  }
} 
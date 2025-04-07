import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ContainerComponent,
        RowComponent,
        ColComponent,
        CardGroupComponent,
        TextColorDirective,
        CardComponent,
        CardBodyComponent,
        FormDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        IconDirective,
        FormControlDirective,
        ButtonDirective,
        NgStyle,
        RouterModule
    ]
})
export class LoginComponent {
    loginForm: FormGroup;
    errorMessage: string = '';
    loading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        const { email, password } = this.loginForm.value;

        this.authService.login(email, password).subscribe({
            next: (user) => {
                this.loading = false;
                // Redirect based on user role
                if (user.role === 'ADMIN') {
                    this.router.navigate(['/admin/dashboard']);
                } else if (user.role === 'PROVIDER') {
                    this.router.navigate(['/provider/dashboard']);
                } else {
                    this.router.navigate(['/client/reservations']);
                }
            },
            error: (error) => {
                this.loading = false;
                this.errorMessage = error.message || 'Invalid email or password';
                console.error('Login error:', error);
            }
        });
    }
}

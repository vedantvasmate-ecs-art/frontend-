import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/auth.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData: RegisterRequest = { name: '', email: '', password: '' };
  confirmPassword: string = '';
  errorMessage: string = '';
  fieldErrors: { [key: string]: string } = {};
  isLoading: boolean = false;
  showPassword: boolean = false;
  selectedRole: string = 'MEMBER';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.fieldErrors = {};

    if (this.registerData.password !== this.confirmPassword) {
      this.fieldErrors['confirmPassword'] = 'Passwords do not match';
      return;
    }

    this.isLoading = true;

    const registerObs = this.selectedRole === 'ADMIN'
      ? this.authService.registerAdmin(this.registerData)
      : this.authService.register(this.registerData);

    registerObs.subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        if (err.error?.errors) {
          this.fieldErrors = err.error.errors;
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}

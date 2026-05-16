import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  isLoading = false;
  loadingRole = '';

  constructor(private authService: AuthService, private router: Router) {
    // If already logged in, redirect to dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  loginAsAdmin(): void {
    this.isLoading = true;
    this.loadingRole = 'admin';

    const credentials = { email: 'demo.admin@ethara.com', password: 'Admin@123' };

    // Try login first
    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        // Account doesn't exist — register as admin, then auto-login
        this.authService.registerAdmin({
          name: 'Demo Admin',
          email: credentials.email,
          password: credentials.password
        }).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.isLoading = false;
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }

  loginAsMember(): void {
    this.isLoading = true;
    this.loadingRole = 'member';

    const credentials = { email: 'demo.member@ethara.com', password: 'Member@123' };

    // Try login first
    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        // Account doesn't exist — register as member, then auto-login
        this.authService.register({
          name: 'Demo Member',
          email: credentials.email,
          password: credentials.password
        }).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.isLoading = false;
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }
}

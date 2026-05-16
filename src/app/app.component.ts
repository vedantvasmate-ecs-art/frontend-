import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Ethara Task Manager';

  constructor(public authService: AuthService, public router: Router) {}

  get showNavbar(): boolean {
    const url = this.router.url;
    return this.authService.isLoggedIn() && !url.includes('/login') && !url.includes('/register') && url !== '/';
  }
}

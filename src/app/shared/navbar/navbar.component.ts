import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  title = 'AppCitas';

  constructor(private session: SessionService, private router: Router) {}

  isLoggedIn(): boolean {
    return this.session.isLoggedIn();
  }

  logout(): void {
    this.session.logout();
    this.router.navigate(['/login']);
  }

  hasRole(roles: string[]) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) return false;
    return roles.includes(user.role);
  }
}
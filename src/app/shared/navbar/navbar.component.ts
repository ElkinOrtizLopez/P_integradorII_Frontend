import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  title = 'Mi app de citas';

  constructor(private session: SessionService, private router: Router) {}//apregado despues del tercer commit

  isLoggedIn(): boolean {
    return this.session.isLoggedIn();
  }

  logout(): void {
    this.session.logout();
    this.router.navigate(['/login']);
  }
}

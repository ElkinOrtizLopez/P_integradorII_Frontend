import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  cargando = false;
  cargandoGoogle = false;

  constructor(private authService: AuthService, private router: Router) {}

  Login() {
    this.errorMessage = '';
    this.cargando = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.errorMessage = err.error?.error || 'Credenciales incorrectas';
        this.cargando = false;
      }
    });
  }

  loginConGoogle() {
    this.errorMessage = '';
    this.cargandoGoogle = true;

    this.authService.loginConGoogle().subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.errorMessage = err.error?.error || 'No se pudo iniciar sesión con Google';
        this.cargandoGoogle = false;
      }
    });
  }
}

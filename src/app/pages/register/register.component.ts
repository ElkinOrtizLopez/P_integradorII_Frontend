// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from '../services/auth.service';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//     <div class="auth-container">
//       <h2>Registro</h2>
//       <form (ngSubmit)="onRegister()">
//         <input type="text" [(ngModel)]="email" name="email" placeholder="Correo electrónico" required />
//         <input type="password" [(ngModel)]="password" name="password" placeholder="Contraseña" required />
//         <button type="submit">Registrarme</button>
//       </form>
//       <p *ngIf="message" class="message">{{ message }}</p>
//     </div>
//   `,
//   styles: [`
//     .auth-container {
//       max-width: 320px;
//       margin: 2rem auto;
//       padding: 1.5rem;
//       background: #fff;
//       border-radius: 10px;
//       box-shadow: 0 0 10px rgba(0,0,0,0.1);
//     }
//     input, button { width: 100%; margin-bottom: 1rem; padding: .5rem; }
//     .message { color: green; font-size: 14px; }
//   `]
// })
// export class RegisterComponent {
//   email = '';
//   password = '';
//   message = '';

//   constructor(private auth: AuthService) {}

//   async onRegister() {
//     try {
//       await this.auth.register(this.email, this.password);
//       this.message = 'Usuario registrado correctamente';
//     } catch (error: any) {
//       this.message = 'Error: ' + error.message;
//     }
//   }
// }

//-------------copailot
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './register.component.html'
// })
// export class RegisterComponent {
//   name = '';
//   email = '';
//   password = '';

//   constructor(private authService: AuthService) {}

//   onRegister() {
//     this.authService.register(this.name, this.email, this.password).subscribe({
//       next: (res) => console.log('Registro exitoso:', res),
//       error: (err) => console.error('Error en registro:', err)
//     });
//   }
// }
// register redirije a login
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router     // 👈 Inyectamos Router
  ) {}

  onRegister() {
    this.authService.register(this.name, this.email, this.password).subscribe({
      next: (res) => {
        console.log('Registro exitoso:', res);

        // 👇 Redirigir al login después de registrarse
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en registro:', err);
      }
    });
  }
}

// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   email = '';
//   password = '';
//   message = '';

//   constructor(private authService: AuthService) {}

//   async login() {
//     try {
//       const user = await this.authService.login(this.email, this.password);
//       this.message = `Bienvenido ${user?.email}`;
//     } catch (error: any) {
//       this.message = error.message;
//     }
//   }
// }

// import { Component } from '@angular/core';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
// })
// export class LoginComponent {
//   email = '';
//   password = '';
//   message = '';

//   constructor(private auth: AuthService) {}

//   async login() {
//     try {
//       const user: any = await this.auth.login(this.email, this.password);
//       this.message = `Bienvenido ${user?.email || 'usuario'}`;
//     } catch (error: any) {
//       this.message = `Error: ${error.message}`;
//     }
//   }
// }

//--- copailot
// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './login.component.html'
// })
// export class LoginComponent {
//   email = '';
//   password = '';

//   constructor(private authService: AuthService) {}

//   onLogin() {
//     this.authService.login(this.email, this.password).subscribe({
//       next: (res) => console.log('Login exitoso:', res),
//       error: (err) => console.error('Error en login:', err)
//     });
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    const body = {
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:3000/api/login', body).subscribe({
      next: (res: any) => {
        console.log('✅ Login exitoso:', res);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/dashboard']); // Ajusta la ruta según tu app
      },
      error: err => {
        console.error('❌ Error en login:', err);
        this.errorMessage = err.error?.error || 'Error desconocido';
      }
    });
  }
}




//segundo conmmit
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule, HttpClientModule],
//   templateUrl: './login.component.html'
// })
// export class LoginComponent {
//   email = '';
//   password = '';
//   errorMessage = '';

//   constructor(private http: HttpClient, private router: Router) {}

//   Login() {
//     const body = {
//       email: this.email,
//       password: this.password
//     };

//     this.http.post('http://localhost:3000/api/login', body).subscribe({
//       next: (res: any) => {
//         console.log('✅ Login exitoso:', res);
//         localStorage.setItem('token', res.token);
//         localStorage.setItem('user', JSON.stringify(res.user));
//         this.router.navigate(['/dashboard']); // Ajusta la ruta según tu app
//       },
//       error: err => {
//         console.error('❌ Error en login:', err);
//         this.errorMessage = err.error?.error || 'Error desconocido';
//       }
//     });
//   }
// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  Login() {
    this.errorMessage = '';

    const body = {
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:3000/api/login', body).subscribe({
      next: (res: any) => {
        console.log('✅ Login exitoso:', res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.error('❌ Error en login:', err);
        this.errorMessage = err.error?.error || 'Error desconocido';
      }
    });
  }

}


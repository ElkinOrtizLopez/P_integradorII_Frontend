//Segundo commit
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './dashboard.component.html'
// })
// export class DashboardComponent {
//   userName = '';

//   ngOnInit() {
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//     this.userName = user.name || 'Usuario';
//   }
// }


// segundo commit
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { SessionService } from '../../services/session.service';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './dashboard.component.html'
// })
// export class DashboardComponent {
//   userName = '';

//   constructor(private session: SessionService) {}

//   ngOnInit() {
//     const user = this.session.getUser();
//     this.userName = user?.name || 'Usuario';
//     console.log('Usuario actual:', user?.name);
//   }
// }


//copailot no muestra el dashboard
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { SessionService } from '../../services/session.service';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule],
//   templateUrl: './dashboard.component.html',
// })
// export class DashboardComponent {
//   userName = '';
//   userRole = '';

//   constructor(private session: SessionService, private http: HttpClient) {}

//   ngOnInit() {
//     const headers = {
//       Authorization: `Bearer ${this.session.getToken()}`
//     };

//     this.http.get<any>('http://localhost:3000/api/profile', { headers }).subscribe({
//       next: res => {
//         this.userName = res.usuario.name;
//         this.userRole = res.usuario.role;
//       },
//       error: err => console.error('❌ Error al obtener perfil:', err)
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  userName = '';
  userRole = '';

  constructor(private session: SessionService, private http: HttpClient) {}

  ngOnInit() {
    const token = this.session.getToken();

    if (!token) {
      console.error('⚠️ No hay token en sesión, redirige al login si es necesario.');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>('http://localhost:3000/api/profile', { headers }).subscribe({
      next: res => {
        console.log('✅ Perfil cargado:', res);
        this.userName = res.usuario.name;
        this.userRole = res.usuario.role;
      },
      error: err => console.error('❌ Error al obtener perfil:', err)
    });
  }
}

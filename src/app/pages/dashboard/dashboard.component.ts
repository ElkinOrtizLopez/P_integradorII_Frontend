//Cuarto commit
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { SessionService } from '../../services/session.service';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule],
//   templateUrl: './dashboard.component.html',
// })
// export class DashboardComponent implements OnInit {
//   userName = '';
//   userRole = '';

//   constructor(private session: SessionService, private http: HttpClient) {}

//   ngOnInit() {
//     const token = this.session.getToken();

//     if (!token) {
//       console.error('⚠️ No hay token en sesión, redirige al login si es necesario.');
//       return;
//     }

//     const headers = { Authorization: `Bearer ${token}` };

//     this.http.get<any>('http://localhost:3000/api/profile', { headers }).subscribe({
//       next: res => {
//         console.log('✅ Perfil cargado:', res);
//         this.userName = res.usuario.name;
//         this.userRole = res.usuario.role;
//       },
//       error: err => console.error('❌ Error al obtener perfil:', err)
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userName: string = '';
  //nextAppointment: any = null;
  stats = {
    upcoming: 0,
    completed: 0,
    cancelled: 0
  };

  //upcomingAppointments: any[] = [];
  featuredDoctors: any[] = [];
  ngOnInit() {
    // Obtener datos del usuario
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      this.userName = parsed.name || 'Usuario';
    }


    this.featuredDoctors = [
      { name: 'Dr. Juan Gomez', specialty: 'Medicina General', years: 12 },
      { name: 'Dra. Laura Gómez', specialty: 'Psicología', years: 8 },
      { name: 'Dr. Pablo Realpe', specialty: 'Odontología', years: 15 },
      { name: 'Dra. Natalia Herrera', specialty: 'Oftalmología', years: 15 }
    ];
  }
}

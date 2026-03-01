// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { CitasService } from '../../services/citas.service';
// import { Router } from '@angular/router';
// import { HttpClientModule } from '@angular/common/http';

// @Component({
//   selector: 'app-pacientes',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule],
//   templateUrl: './pacientes.component.html',
//   styleUrls: ['./pacientes.component.css']
// })
// export class PacientesComponent implements OnInit {

//   pacientes: any[] = [];
//   doctorId: number | null = null;

//   constructor(private srv: CitasService, private router: Router) {}

//   ngOnInit() {
//     const user = JSON.parse(localStorage.getItem('user') || 'null');

//     if (!user || !['admin','doctor'].includes(user.role)) {
//       this.router.navigate(['/dashboard']);
//       return;
//     }

//     this.doctorId = user.id;

//     this.loadPacientes();
//   }

//   loadPacientes() {
//     if (!this.doctorId) return;

//     this.srv.getPacientesDelDoctor(this.doctorId).subscribe(res => {
//       this.pacientes = res;
//     });
//   }
// }

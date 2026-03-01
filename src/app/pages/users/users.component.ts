import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../services/citas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  
  citas: any[] = [];
  cargando = true;
  userRole = JSON.parse(localStorage.getItem('user') || '{}').role;

  constructor(private citasService: CitasService) {}

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas() {
    this.citasService.getCitasDelDia().subscribe({
      next: (res) => {
        this.citas = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

}


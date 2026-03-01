import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CitasService } from '../../services/citas.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName = '';
  userRole = '';
  cargando = true;

  // Estadísticas del paciente (de sus propias citas)
  statsUsuario = { activas: 0, canceladas: 0, proxima: null as any };

  // Estadísticas globales (solo admin)
  statsAdmin: any = null;

  // Lista de especialistas desde la BD
  especialistas: any[] = [];

  constructor(
    private citasService: CitasService,
    private session: SessionService
  ) {}

  ngOnInit() {
    const user = this.session.getUser();
    if (user) {
      this.userName = user.name || 'Usuario';
      this.userRole = user.role || 'user';
    }

    // Todos ven los especialistas reales
    this.citasService.getEspecialistas().subscribe({
      next: data => {
        this.especialistas = data.slice(0, 4); // Máximo 4 en el dashboard
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });

    // Admin: cargar estadísticas globales
    if (this.userRole === 'admin') {
      this.citasService.getStats().subscribe({
        next: data => { this.statsAdmin = data; },
        error: () => {}
      });
    }

    // Paciente: cargar resumen de sus citas
    if (this.userRole !== 'admin') {
      this.citasService.getMisCitas().subscribe({
        next: (citas: any[]) => {
          this.statsUsuario.activas = citas.filter(c => c.estado === 'activa').length;
          this.statsUsuario.canceladas = citas.filter(c => c.estado === 'cancelada').length;
          // Próxima cita: la más cercana con estado activa
          const futuras = citas
            .filter(c => c.estado === 'activa' && c.fecha >= new Date().toISOString().split('T')[0])
            .sort((a, b) => a.fecha.localeCompare(b.fecha));
          this.statsUsuario.proxima = futuras[0] ?? null;
        },
        error: () => {}
      });
    }
  }
}

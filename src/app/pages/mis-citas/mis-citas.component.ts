import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CitasService } from '../../services/citas.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mis-citas.component.html',
  styleUrls: ['./mis-citas.component.css']
})
export class MisCitasComponent implements OnInit {
  citas: any[] = [];

  reprogramarModo = false;
  citaSeleccionada: any = null;
  nuevaFecha = '';
  nuevaHora = '';

  constructor(private srv: CitasService, private toast: ToastService) {}

  ngOnInit() {
    this.loadCitas();
  }

  loadCitas() {
    // Ya no pasamos usuario_id: el backend lo extrae del token via interceptor
    this.srv.getMisCitas().subscribe({
      next: res => this.citas = res,
      error: () => this.toast.error('No se pudieron cargar las citas')
    });
  }

  cancelar(cita: any) {
    this.srv.cancelarCita(cita.id).subscribe({
      next: () => {
        this.toast.exito('Cita cancelada correctamente');
        this.loadCitas();
      },
      error: () => this.toast.error('No se pudo cancelar la cita')
    });
  }

  abrirReprogramar(cita: any) {
    this.citaSeleccionada = cita;
    this.reprogramarModo = true;
  }

  guardarReprogramar() {
    this.srv.reprogramarCita({
      cita_id: this.citaSeleccionada.id,
      nueva_fecha: this.nuevaFecha,
      nueva_hora: this.nuevaHora + ':00'
    }).subscribe({
      next: () => {
        this.toast.exito('Cita reprogramada correctamente');
        this.reprogramarModo = false;
        this.loadCitas();
      },
      error: err => this.toast.error(err.error?.error || 'Horario no disponible')
    });
  }

  cerrarModal() {
    this.reprogramarModo = false;
  }
}

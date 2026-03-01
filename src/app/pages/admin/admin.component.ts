import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitasService } from '../../services/citas.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class AdminComponent implements OnInit {
  especialistas: any[] = [];
  cargando = true;
  mostrarFormulario = false;
  modoEdicion = false;

  formulario = {
    id: null as number | null,
    nombre: '',
    especialidad: '',
    biografia: '',
    foto_url: '',
    disponible: true,
  };

  constructor(
    private citasService: CitasService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.cargarEspecialistas();
  }

  cargarEspecialistas() {
    this.cargando = true;
    this.citasService.getEspecialistas().subscribe({
      next: data => { this.especialistas = data; this.cargando = false; },
      error: () => { this.toast.error('Error al cargar especialistas'); this.cargando = false; }
    });
  }

  abrirCrear() {
    this.formulario = { id: null, nombre: '', especialidad: '', biografia: '', foto_url: '', disponible: true };
    this.modoEdicion = false;
    this.mostrarFormulario = true;
  }

  abrirEditar(esp: any) {
    this.formulario = {
      id: esp.id,
      nombre: esp.nombre,
      especialidad: esp.especialidad,
      biografia: esp.biografia || '',
      foto_url: esp.foto_url || '',
      disponible: esp.disponible,
    };
    this.modoEdicion = true;
    this.mostrarFormulario = true;
  }

  cancelar() {
    this.mostrarFormulario = false;
  }

  guardar() {
    if (!this.formulario.nombre || !this.formulario.especialidad) {
      this.toast.error('Nombre y especialidad son obligatorios');
      return;
    }

    if (this.modoEdicion && this.formulario.id) {
      this.citasService.actualizarEspecialista(this.formulario.id, this.formulario).subscribe({
        next: () => {
          this.toast.exito('Especialista actualizado correctamente');
          this.mostrarFormulario = false;
          this.cargarEspecialistas();
        },
        error: err => this.toast.error(err.error?.error || 'Error al actualizar')
      });
    } else {
      this.citasService.crearEspecialista(this.formulario).subscribe({
        next: () => {
          this.toast.exito('Especialista creado correctamente');
          this.mostrarFormulario = false;
          this.cargarEspecialistas();
        },
        error: err => this.toast.error(err.error?.error || 'Error al crear')
      });
    }
  }

  eliminar(esp: any) {
    if (!confirm(`¿Eliminar a ${esp.nombre}? Esta acción no se puede deshacer.`)) return;

    this.citasService.eliminarEspecialista(esp.id).subscribe({
      next: () => {
        this.toast.exito(`${esp.nombre} eliminado`);
        this.cargarEspecialistas();
      },
      error: err => this.toast.error(err.error?.error || 'Error al eliminar')
    });
  }
}

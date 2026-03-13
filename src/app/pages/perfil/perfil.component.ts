import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  email = '';
  name = '';
  role = '';
  creadoEn = '';

  cargando = false;
  guardando = false;

  constructor(
    private auth: AuthService,
    private session: SessionService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.cargando = true;
    this.auth.getPerfil().subscribe({
      next: (res) => {
        this.email = res.user.email;
        this.name = res.user.name;
        this.role = res.user.role;
        this.creadoEn = res.user.created_at;
        this.cargando = false;
      },
      error: () => {
        this.toast.error('No se pudo cargar el perfil');
        this.cargando = false;
      }
    });
  }

  guardar(): void {
    if (!this.name.trim()) {
      this.toast.error('El nombre no puede estar vacío');
      return;
    }

    this.guardando = true;
    this.auth.actualizarPerfil(this.name.trim()).subscribe({
      next: (res) => {
        const userActual = this.session.getUser() ?? {};
        this.session.saveUser({ ...userActual, name: res.user.name });
        this.toast.exito('Perfil actualizado correctamente');
        this.guardando = false;
      },
      error: (err) => {
        const msg = err?.error?.error || 'Error al actualizar el perfil';
        this.toast.error(msg);
        this.guardando = false;
      }
    });
  }

  rolLabel(): string {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      doctor: 'Doctor',
      user: 'Paciente'
    };
    return labels[this.role] ?? this.role;
  }

  fechaFormateada(): string {
    if (!this.creadoEn) return '';
    return new Date(this.creadoEn).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
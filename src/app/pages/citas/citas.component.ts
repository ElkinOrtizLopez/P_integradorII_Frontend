import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CitasService } from '../../services/citas.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {
  especialistas: any[] = [];
  selectedEspecialista: any = null;
  semana: { date: Date; label: string; iso: string }[] = [];
  horariosByDay: Record<string, { hora: string; disponible: boolean }[]> = {};
  slotDurationMinutes = 30;
  userId: number | null = null;

  constructor(private srv: CitasService, private toast: ToastService) {}

  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('user') || 'null')?.id ?? null;
    this.loadEspecialistas();
    this.generateSemanaActual();
  }

  loadEspecialistas() {
    this.srv.getEspecialistas().subscribe(res => {
      const wanted = ['Medicina General', 'Oftalmología', 'Psicología', 'Odontología'];
      this.especialistas = res.filter((e: any) => wanted.includes(e.especialidad));
    });
  }

  selectEspecialista(e: any) {
    this.selectedEspecialista = e;
    this.refreshSlots();
  }

  generateSemanaActual() {
    const today = new Date();
    const day = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() + (day === 0 ? -6 : 1 - day));

    this.semana = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      this.semana.push({ date: d, label: d.toLocaleDateString(), iso });
    }
  }

  async refreshSlots() {
    if (!this.selectedEspecialista) return;
    this.horariosByDay = {};
    for (const day of this.semana) {
      await this.loadSlotsForDay(day.iso);
    }
  }

  async loadSlotsForDay(fechaIso: string) {
    const especialista_id = this.selectedEspecialista.id;
    const horarios = await firstValueFrom(this.srv.getHorarios(especialista_id));

    const parts = fechaIso.split('-');
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const diaNum = d.getDay() === 0 ? 7 : d.getDay();
    const horariosDelDia = horarios.filter((h: any) => Number(h.dia_semana) === diaNum);

    const citasExistentes = await firstValueFrom(this.srv.getCitas(especialista_id, fechaIso));
    const ocupadas = new Set(
      citasExistentes.filter((c: any) => c.estado === 'activa').map((c: any) => c.hora.slice(0, 5))
    );

    const slots: { hora: string; disponible: boolean }[] = [];
    for (const h of horariosDelDia) {
      let start = this.toMinutos(h.hora_inicio);
      const end = this.toMinutos(h.hora_fin);
      while (start + this.slotDurationMinutes <= end) {
        const hhmm = this.toHora(start);
        slots.push({ hora: hhmm, disponible: !ocupadas.has(hhmm) });
        start += this.slotDurationMinutes;
      }
    }
    this.horariosByDay[fechaIso] = slots;
  }

  toMinutos(t: string) {
    const [hh, mm] = t.split(':').map(Number);
    return hh * 60 + mm;
  }

  toHora(mins: number) {
    return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
  }

  reservar(fecha: string, hora: string) {
    if (!this.userId) {
      this.toast.error('Debes iniciar sesión para reservar');
      return;
    }

    const payload = { usuario_id: this.userId, especialista_id: this.selectedEspecialista.id, fecha, hora: hora + ':00' };

    this.srv.crearCita(payload).subscribe({
      next: () => {
        this.toast.exito('Cita reservada correctamente');
        this.loadSlotsForDay(fecha);
      },
      error: err => {
        this.toast.error(err.error?.error || 'No se pudo crear la cita');
        this.loadSlotsForDay(fecha);
      }
    });
  }
}

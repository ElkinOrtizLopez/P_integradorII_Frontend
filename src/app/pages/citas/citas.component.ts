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
  horariosByDay: Record<string, { hora: string; disponible: boolean; pasado: boolean }[]> = {};
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
    const DIAS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    // Si es sábado (6) avanzar 2 días, si es domingo (0) avanzar 1
    const dow = cursor.getDay();
    if (dow === 6) cursor.setDate(cursor.getDate() + 2);
    else if (dow === 0) cursor.setDate(cursor.getDate() + 1);

    // Recolectar exactamente 5 días hábiles (lunes a viernes) desde hoy
    this.semana = [];
    while (this.semana.length < 5) {
      const dayOfWeek = cursor.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const iso = cursor.toISOString().slice(0, 10);
        const label = `${DIAS_ES[dayOfWeek]} ${cursor.getDate()}`;
        this.semana.push({ date: new Date(cursor), label, iso });
      }
      cursor.setDate(cursor.getDate() + 1);
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

    // Detectar si este día es hoy para deshabilitar horas pasadas
    const ahora = new Date();
    const esHoy = fechaIso === ahora.toISOString().slice(0, 10);
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

    const slots: { hora: string; disponible: boolean; pasado: boolean }[] = [];
    for (const h of horariosDelDia) {
      let start = this.toMinutos(h.hora_inicio);
      const end = this.toMinutos(h.hora_fin);
      while (start + this.slotDurationMinutes <= end) {
        const hhmm = this.toHora(start);
        const pasado = esHoy && start <= minutosAhora;
        slots.push({ hora: hhmm, disponible: !ocupadas.has(hhmm), pasado });
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

    // Verificación extra por si el usuario burló el disabled del botón
    const slot = (this.horariosByDay[fecha] || []).find(s => s.hora === hora);
    if (slot?.pasado) {
      this.toast.error('Este horario ya pasó, elige otro');
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

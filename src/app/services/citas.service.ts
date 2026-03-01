import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CitasService {
  private base = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  getEspecialistas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/especialistas`);
  }

  getHorarios(especialista_id: number) {
    return this.http.get<any[]>(`${this.base}/horarios?especialista_id=${especialista_id}`);
  }

  getCitas(especialista_id: number, fecha: string) {
    return this.http.get<any[]>(`${this.base}/citas?especialista_id=${especialista_id}&fecha=${fecha}`);
  }

  crearCita(payload: any) {
    return this.http.post(`${this.base}/citas`, payload);
  }

  // El token se adjunta automáticamente desde el interceptor HTTP (Día 2)
  getMisCitas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/mis-citas`);
  }

  cancelarCita(cita_id: number) {
    return this.http.post(`${this.base}/citas/cancelar`, { cita_id });
  }

  reprogramarCita(payload: { cita_id: number; nueva_fecha: string; nueva_hora: string }) {
    return this.http.post(`${this.base}/citas/reprogramar`, payload);
  }

  getCitasDelDia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/especialistas/citas`);
  }

  // ── Admin ──────────────────────────────────────────────────────────────────

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.base}/stats`);
  }

  crearEspecialista(data: any): Observable<any> {
    return this.http.post(`${this.base}/especialistas`, data);
  }

  actualizarEspecialista(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/especialistas/${id}`, data);
  }

  eliminarEspecialista(id: number): Observable<any> {
    return this.http.delete(`${this.base}/especialistas/${id}`);
  }
}

import { Injectable, signal } from '@angular/core';

export type ToastTipo = 'exito' | 'error' | 'info';

export interface ToastMensaje {
  id: number;
  texto: string;
  tipo: ToastTipo;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  mensajes = signal<ToastMensaje[]>([]);
  private contador = 0;

  private mostrar(texto: string, tipo: ToastTipo) {
    const id = ++this.contador;
    this.mensajes.update(m => [...m, { id, texto, tipo }]);
    // Desaparece automaticamente en 3 segundos
    setTimeout(() => this.cerrar(id), 3000);
  }

  exito(texto: string)  { this.mostrar(texto, 'exito'); }
  error(texto: string)  { this.mostrar(texto, 'error'); }
  info(texto: string)   { this.mostrar(texto, 'info'); }

  cerrar(id: number) {
    this.mensajes.update(m => m.filter(msg => msg.id !== id));
  }
}

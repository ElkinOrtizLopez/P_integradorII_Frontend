import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-contenedor">
      @for (msg of toast.mensajes(); track msg.id) {
        <div class="toast toast-{{ msg.tipo }}">
          <span>{{ msg.texto }}</span>
          <button (click)="toast.cerrar(msg.id)">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-contenedor {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 18px;
      border-radius: 8px;
      min-width: 260px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: entrar 0.3s ease;
    }
    .toast button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      opacity: 0.7;
      line-height: 1;
    }
    .toast-exito { background: #d4edda; color: #155724; border-left: 4px solid #28a745; }
    .toast-error  { background: #f8d7da; color: #721c24; border-left: 4px solid #dc3545; }
    .toast-info   { background: #d1ecf1; color: #0c5460; border-left: 4px solid #17a2b8; }
    @keyframes entrar {
      from { opacity: 0; transform: translateX(40px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `]
})
export class ToastComponent {
  toast = inject(ToastService);
}

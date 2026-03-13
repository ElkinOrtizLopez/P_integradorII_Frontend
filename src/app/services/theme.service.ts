import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly KEY = 'app-theme';

  constructor() {
    // Restaura el tema guardado o detecta preferencia del sistema
    const guardado = localStorage.getItem(this.KEY);
    const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = guardado === 'dark' || (!guardado && prefiereOscuro);
    this.aplicar(dark);
  }

  isDark(): boolean {
    return document.documentElement.classList.contains('dark');
  }

  toggle(): void {
    const ahora = !this.isDark();
    this.aplicar(ahora);
    localStorage.setItem(this.KEY, ahora ? 'dark' : 'light');
  }

  private aplicar(dark: boolean): void {
    document.documentElement.classList.toggle('dark', dark);
  }
}
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// Rutas que no necesitan token
const RUTAS_PUBLICAS = ['/api/login', '/api/register', '/api/auth/login'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionService);
  const router = inject(Router);

  const esPublica = RUTAS_PUBLICAS.some(ruta => req.url.includes(ruta));
  const token = session.getToken();

  // Si hay token y la ruta no es publica, lo adjuntamos
  const reqConToken = token && !esPublica
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(reqConToken).pipe(
    catchError(err => {
      // Si el servidor dice 401, cerramos sesion y mandamos al login
      if (err.status === 401) {
        session.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};

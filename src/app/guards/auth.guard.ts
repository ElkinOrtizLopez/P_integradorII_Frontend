import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { SessionService } from '../services/session.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private session: SessionService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.session.getToken();

    // 1. Sin token → login
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    let decoded: any;
    try {
      decoded = jwtDecode(token);
    } catch {
      // Token malformado → limpiar y login
      this.session.logout();
      this.router.navigate(['/login']);
      return false;
    }

    // 2. Token expirado → limpiar y login
    const ahora = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < ahora) {
      this.session.logout();
      this.router.navigate(['/login']);
      return false;
    }

    // 3. Control por rol (si la ruta lo define en data.roles)
    const rolesPermitidos: string[] = route.data?.['roles'];
    if (rolesPermitidos && rolesPermitidos.length > 0) {
      if (!rolesPermitidos.includes(decoded.role)) {
        // Tiene token valido pero no el rol → manda al dashboard
        this.router.navigate(['/dashboard']);
        return false;
      }
    }

    return true;
  }
}

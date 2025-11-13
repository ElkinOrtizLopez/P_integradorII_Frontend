// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { SessionService } from '../services/session.service';

// @Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {
//   constructor(private session: SessionService, private router: Router) {}

//   canActivate(): boolean {
//     const user = this.session.getUser();
//     if (user && user.role === 'admin') { //solo "dasward" para admin
//       return true;
//     }
//     // const token = this.session.getToken();
//     // if (token){
//     //   return true;
//     // }
    
//     this.router.navigate(['/login']);
//     return false;
//   }
// }

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService } from '../services/session.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private session: SessionService, private router: Router) {}

  canActivate(): boolean {
    const token = this.session.getToken();

    if (token) {
      // ✅ Si hay token, el usuario puede acceder a cualquier ruta protegida
      return true;
    }

    // ❌ Si no hay token, redirige al login
    this.router.navigate(['/login']);
    return false;
  }
}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { environment } from '../../environments/environment';

// Inicializar Firebase solo una vez
if (!getApps().length) {
  initializeApp(environment.firebase);
}

// Mapeo de códigos de error de Firebase a mensajes en español
const FIREBASE_ERRORS: Record<string, string> = {
  'auth/operation-not-allowed': 'El login con Google no está habilitado en Firebase. Actívalo en Authentication → Sign-in method.',
  'auth/popup-blocked': 'El navegador bloqueó la ventana emergente. Permite popups para este sitio e intenta de nuevo.',
  'auth/popup-closed-by-user': 'Cancelaste el inicio de sesión con Google.',
  'auth/cancelled-popup-request': 'Se canceló la solicitud de login.',
  'auth/network-request-failed': 'Error de red. Verifica tu conexión a internet.',
  'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase. Agrégalo en Authentication → Settings → Authorized domains.',
  'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/login`, { email, password });
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/register`, { name, email, password });
  }

  /**
   * Login con Google usando Firebase Auth.
   * 1. Abre el popup de Google.
   * 2. Obtiene el ID token de Firebase.
   * 3. Lo envía al backend /api/auth/login que verifica y devuelve nuestro JWT.
   */
  loginConGoogle(): Observable<any> {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    return from(signInWithPopup(auth, provider)).pipe(
      catchError(firebaseErr => {
        const codigo = firebaseErr.code as string;
        const mensaje = FIREBASE_ERRORS[codigo] ?? `Error de Firebase: ${codigo}`;
        console.error('[Google Login] Firebase error:', codigo, firebaseErr.message);
        return throwError(() => ({ error: { error: mensaje } }));
      }),
      switchMap(result => from((result as any).user.getIdToken())),
      switchMap(firebaseToken =>
        this.http.post(`${this.apiUrl}/api/auth/login`, { token: firebaseToken })
      )
    );
  }
}

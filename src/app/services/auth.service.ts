// import { Injectable } from '@angular/core';
// import { signInWithEmailAndPassword, User } from 'firebase/auth';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../environments/environment';
// import { firebaseAuth } from '../firebase.config';
// import { createUserWithEmailAndPassword } from 'firebase/auth';

// @Injectable({ providedIn: 'root' })
// export class AuthService {

//   constructor(private http: HttpClient) {}

//   async login(email: string, password: string): Promise<User | null> {
//     // 🔥 1️⃣ Autenticamos con Firebase
//     const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
//     const user = userCredential.user;

//     // 🔥 2️⃣ Obtenemos el token
//     const token = await user.getIdToken();

//     // 🔥 3️⃣ Lo enviamos al backend Next.js
//     await this.http.post(`${environment.apiUrl}/api/auth/login`, { token }).toPromise();

//     return user;
//   }

//   async register(email: string, password: string): Promise<void> {
//     const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
//     const user = userCredential.user;
//     const token = await user.getIdToken();

//     // Envía el token al backend para guardar el usuario
//     await this.http.post(`${environment.apiUrl}/api/auth/register`, { token }).toPromise();
//   }
// }

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { initializeApp } from 'firebase/app';
// import {
//   getAuth,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   User
// } from 'firebase/auth';
// import { environment } from '../../environments/environment';
// import { firstValueFrom } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private firebaseApp = initializeApp(environment.firebase);
//   private auth = getAuth(this.firebaseApp);
//   private backendUrl = 'http://localhost:3000/api/auth'; // cambia si usas otro puerto o dominio

//   currentUser: User | null = null;

//   constructor(private http: HttpClient) {
//     // Mantener sincronizado el usuario actual
//     onAuthStateChanged(this.auth, (user) => {
//       this.currentUser = user;
//     });
//   }

//   /**
//    * 🔐 REGISTRO de usuario con Firebase + backend Next.js
//    */
//   async register(email: string, password: string, name: string) {
//     // Crear usuario en Firebase
//     const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
//     const user = userCredential.user;

//     // Obtener token de Firebase
//     const token = await user.getIdToken();

//     // Enviar datos al backend para registrarlo también en PostgreSQL
//     const body = { token, name };
//     const response = await firstValueFrom(this.http.post(`${this.backendUrl}/login`, body));

//     return response;
//   }

//   /**
//    * 🔑 LOGIN de usuario con Firebase + validación en backend
//    */
//   async login(email: string, password: string) {
//     // Iniciar sesión en Firebase
//     const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
//     const user = userCredential.user;

//     // Obtener el token de Firebase
//     const token = await user.getIdToken();

//     // Enviar el token al backend (Next.js) para validarlo y crear JWT interno
//     const body = { token };
//     const response = await firstValueFrom(this.http.post(`${this.backendUrl}/login`, body));

//     return response;
//   }

//   /**
//    * 👤 Obtener información del usuario autenticado desde el backend
//    */
//   async getUserProfile() {
//     if (!this.currentUser) throw new Error('Usuario no autenticado');
//     const token = await this.currentUser.getIdToken();

//     const headers = { Authorization: `Bearer ${token}` };
//     const response = await firstValueFrom(this.http.get(`${this.backendUrl}/me`, { headers }));

//     return response;
//   }

//   /**
//    * 🚪 Cerrar sesión en Firebase
//    */
//   async logout() {
//     await signOut(this.auth);
//     this.currentUser = null;
//   }
// }


//------- copailot
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/login', { email, password });
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/register', { name, email, password });
  }
}






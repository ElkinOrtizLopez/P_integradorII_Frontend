import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from '../environments/environment';

// Inicializa la app Firebase (solo una vez)
export const firebaseApp = initializeApp(environment.firebase);

// Exporta la instancia de Auth lista para usar
export const firebaseAuth = getAuth(firebaseApp);

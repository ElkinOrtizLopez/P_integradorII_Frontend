import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { HomeComponent } from './pages/home/home.component';
import { CitasComponent } from './pages/citas/citas.component';
import { MisCitasComponent } from './pages/mis-citas/mis-citas.component';
import { UsersComponent } from './pages/users/users.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',      component: HomeComponent },
  { path: 'login',     component: LoginComponent },
  { path: 'register',  component: RegisterComponent },

  // Rutas para cualquier usuario autenticado
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'citas',     component: CitasComponent,     canActivate: [AuthGuard] },
  { path: 'mis-citas', component: MisCitasComponent,  canActivate: [AuthGuard] },
  { path: 'servicios', component: ServiciosComponent,  canActivate: [AuthGuard] },

  // Solo admin
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },

  // Solo doctor o admin
  {
    path: 'pacientes',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'doctor'] }
  }
];

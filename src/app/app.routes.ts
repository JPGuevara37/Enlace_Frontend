import { Routes } from '@angular/router';

import { LoginComponent } from './vistas/login/login.component';
import { NuevoComponent } from './vistas/nuevo/nuevo.component';
import { EditarComponent } from './vistas/editar/editar.component';
import { DashboardComponent } from './vistas/dashboard/dashboard.component';
import { EncargadosComponent } from './vistas/encargados/encargados.component';
import { NuevoEncargadosComponent } from './vistas/nuevo-encargados/nuevo-encargados.component';
import { EditarEncargadosComponent } from './vistas/editar-encargados/editar-encargados.component';
import { AlumnosComponent } from './vistas/alumnos/alumnos.component';
import { NuevoAlumnosComponent } from './vistas/nuevo-alumnos/nuevo-alumnos.component';
import { EditarAlumnosComponent } from './vistas/editar-alumnos/editar-alumnos.component';
import { ProfesoresComponent } from './vistas/profesores/profesores.component';
import { NuevoProfesoresComponent } from './vistas/nuevo-profesores/nuevo-profesores.component';
import { EditarProfesoresComponent } from './vistas/editar-profesores/editar-profesores.component';
import { RecursosComponent } from './vistas/recursos/recursos.component';
import { NuevoRecursosComponent } from './vistas/nuevo-recursos/nuevo-recursos.component';
import { EditarRecursosComponent } from './vistas/editar-recursos/editar-recursos.component';
import { MaterialComponent } from './vistas/material/material.component';
import { SignupComponent } from './vistas/signup/signup.component';
import { LoguotComponent } from './plantillas/loguot/loguot.component';
import { ResetComponent } from './vistas/reset/reset.component';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'nuevo', component: NuevoComponent, canActivate: [authGuard] },
  { path: 'editar/:id', component: EditarComponent, canActivate: [authGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'logout', component: LoguotComponent, canActivate: [authGuard] },

  { path: 'encargados', component: EncargadosComponent, canActivate: [authGuard] },
  { path: 'editar-encargados/:id', component: EditarEncargadosComponent, canActivate: [authGuard] },
  { path: 'nuevo-encargados', component: NuevoEncargadosComponent, canActivate: [authGuard] },

  { path: 'alumnos', component: AlumnosComponent, canActivate: [authGuard] },
  { path: 'editar-alumnos/:id', component: EditarAlumnosComponent, canActivate: [authGuard] },
  { path: 'nuevo-alumnos', component: NuevoAlumnosComponent, canActivate: [authGuard] },

  { path: 'profesores', component: ProfesoresComponent, canActivate: [authGuard] },
  { path: 'editar-profesores/:id', component: EditarProfesoresComponent, canActivate: [authGuard] },
  { path: 'nuevo-profesores', component: NuevoProfesoresComponent, canActivate: [authGuard] },

  { path: 'recursos', component: RecursosComponent, canActivate: [authGuard] },
  { path: 'editar-recursos/:id', component: EditarRecursosComponent, canActivate: [authGuard] },
  { path: 'nuevo-recursos', component: NuevoRecursosComponent, canActivate: [authGuard] },

  { path: 'material', component: MaterialComponent, canActivate: [authGuard] },

  { path: 'reset', component: ResetComponent },
];

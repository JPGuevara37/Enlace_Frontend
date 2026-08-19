import { Routes } from '@angular/router';

import { LoginComponent } from './vistas/login/login.component';
import { LayoutComponent } from './plantillas/layout/layout.component';
import { HomeComponent } from './vistas/home/home.component';
import { DashboardComponent } from './vistas/dashboard/dashboard.component';
import { NuevoComponent } from './vistas/nuevo/nuevo.component';
import { EditarComponent } from './vistas/editar/editar.component';
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
import { ResetComponent } from './vistas/reset/reset.component';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'reset', component: ResetComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'nuevo', component: NuevoComponent },
      { path: 'editar/:id', component: EditarComponent },
      { path: 'encargados', component: EncargadosComponent },
      { path: 'editar-encargados/:id', component: EditarEncargadosComponent },
      { path: 'nuevo-encargados', component: NuevoEncargadosComponent },
      { path: 'alumnos', component: AlumnosComponent },
      { path: 'editar-alumnos/:id', component: EditarAlumnosComponent },
      { path: 'nuevo-alumnos', component: NuevoAlumnosComponent },
      { path: 'profesores', component: ProfesoresComponent },
      { path: 'editar-profesores/:id', component: EditarProfesoresComponent },
      { path: 'nuevo-profesores', component: NuevoProfesoresComponent },
      { path: 'recursos', component: RecursosComponent },
      { path: 'editar-recursos/:id', component: EditarRecursosComponent },
      { path: 'nuevo-recursos', component: NuevoRecursosComponent },
      { path: 'material', component: MaterialComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];

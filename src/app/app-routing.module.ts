import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './vistas/login/login.component';
import { NuevoComponent } from './vistas/nuevo/nuevo.component';
import { EditarComponent } from './vistas/editar/editar.component';
import { DashboardComponent } from './vistas/dashboard/dashboard.component';
//formato para fecha
import { DatePipe } from '@angular/common';

//Encargados
import { EncargadosComponent } from './vistas/encargados/encargados.component';
import { NuevoEncargadosComponent } from './vistas/nuevo-encargados/nuevo-encargados.component';
import { EditarEncargadosComponent } from './vistas/editar-encargados/editar-encargados.component';

//Alumnos
import { AlumnosComponent } from './vistas/alumnos/alumnos.component';
import { NuevoAlumnosComponent } from './vistas/nuevo-alumnos/nuevo-alumnos.component';
import { EditarAlumnosComponent } from './vistas/editar-alumnos/editar-alumnos.component';

//Profesores
import { ProfesoresComponent } from './vistas/profesores/profesores.component';
import { NuevoProfesoresComponent } from './vistas/nuevo-profesores/nuevo-profesores.component';
import { EditarProfesoresComponent } from './vistas/editar-profesores/editar-profesores.component';

//Recursos
import { RecursosComponent } from './vistas/recursos/recursos.component';
import { NuevoRecursosComponent } from './vistas/nuevo-recursos/nuevo-recursos.component';
import { EditarRecursosComponent } from './vistas/editar-recursos/editar-recursos.component';

//Sistema de Login
import { SignupComponent } from './vistas/signup/signup.component';
import { LoguotComponent } from './plantillas/loguot/loguot.component';


//Guards
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path : '' , redirectTo : 'login' , pathMatch : 'full'},
  { path : 'login' , component:LoginComponent },
  { path : 'dashboard' , component:DashboardComponent, canActivate:[AuthGuard]},
  { path : 'nuevo' , component:NuevoComponent, canActivate:[AuthGuard] },
  { path : 'editar/:id' , component:EditarComponent, canActivate:[AuthGuard] },
  { path: 'signup', component:SignupComponent, canActivate:[AuthGuard]},
  { path: 'logout', component:LoguotComponent, canActivate:[AuthGuard] },
  
  //rutas para encargados
  { path: 'encargados', component:EncargadosComponent, canActivate:[AuthGuard] },
  { path: 'editar-encargados/:id' , component:EditarEncargadosComponent, canActivate:[AuthGuard] },
  { path: 'nuevo-encargados' , component:NuevoEncargadosComponent, canActivate:[AuthGuard] },

  //rutas para Alumnos
  { path: 'alumnos', component:AlumnosComponent, canActivate:[AuthGuard]},
  { path: 'editar-alumnos/:id', component:EditarAlumnosComponent, canActivate:[AuthGuard]},
  { path: 'nuevo-alumnos' , component : NuevoAlumnosComponent, canActivate:[AuthGuard]},

  //rutos para Profesores

  { path: 'profesores' ,  component:ProfesoresComponent, canActivate:[AuthGuard]},
  { path: 'editar-profesores/:id', component:EditarProfesoresComponent, canActivate:[AuthGuard]},
  { path: 'nuevo-profesores' , component:NuevoProfesoresComponent, canActivate:[AuthGuard]},

  //rutas para Recursos
  { path: 'recursos' ,  component:RecursosComponent, canActivate:[AuthGuard]},
  { path: 'editar-recursos/:id', component:EditarRecursosComponent, canActivate:[AuthGuard]},
  { path: 'nuevo-recursos' , component:NuevoRecursosComponent, canActivate:[AuthGuard]},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [DatePipe]
})
export class AppRoutingModule { }
export const rountingComponents = [LoginComponent,DashboardComponent,NuevoComponent,EditarComponent,AlumnosComponent,NuevoAlumnosComponent,EditarAlumnosComponent,
ProfesoresComponent,NuevoProfesoresComponent,EditarProfesoresComponent,RecursosComponent,NuevoRecursosComponent,EditarRecursosComponent]


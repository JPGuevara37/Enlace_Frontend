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
import { SignupComponent } from './vistas/signup/signup.component';

const routes: Routes = [
  { path : '' , redirectTo : 'login' , pathMatch : 'full'},
  { path : 'login' , component:LoginComponent },
  { path : 'dashboard' , component:DashboardComponent },
  { path : 'nuevo' , component:NuevoComponent },
  { path : 'editar/:id' , component:EditarComponent },
  { path: 'signup', component:SignupComponent},
  
  //rutas para encargados
  { path: 'encargados', component:EncargadosComponent },
  { path: 'editar-encargados/:id' , component:EditarEncargadosComponent },
  { path: 'nuevo-encargados' , component:NuevoEncargadosComponent },

  //rutas para Alumnos
  { path: 'alumnos', component:AlumnosComponent},
  { path: 'editar-alumnos/:id', component:EditarAlumnosComponent},
  { path: 'nuevo-alumnos' , component : NuevoAlumnosComponent},

  //rutos para Profesores

  { path: 'profesores' ,  component:ProfesoresComponent},
  { path: 'editar-profesores/:id', component:EditarProfesoresComponent},
  { path: 'nuevo-profesores' , component:NuevoProfesoresComponent},

  //rutas para Recursos
  { path: 'recursos' ,  component:RecursosComponent},
  { path: 'editar-recursos/:id', component:EditarRecursosComponent},
  { path: 'nuevo-recursos' , component:NuevoRecursosComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [DatePipe]
})
export class AppRoutingModule { }
export const rountingComponents = [LoginComponent,DashboardComponent,NuevoComponent,EditarComponent,AlumnosComponent,NuevoAlumnosComponent,EditarAlumnosComponent,
ProfesoresComponent,NuevoProfesoresComponent,EditarProfesoresComponent,RecursosComponent,NuevoRecursosComponent,EditarRecursosComponent]


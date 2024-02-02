import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './vistas/login/login.component';
import { NuevoComponent } from './vistas/nuevo/nuevo.component';
import { EditarComponent } from './vistas/editar/editar.component';
import { DashboardComponent } from './vistas/dashboard/dashboard.component';

//Encargados
import { EncargadosComponent } from './vistas/encargados/encargados.component';
import { NuevoEncargadosComponent } from './vistas/nuevo-encargados/nuevo-encargados.component';
import { EditarEncargadosComponent } from './vistas/editar-encargados/editar-encargados.component';

//Alumnos


const routes: Routes = [
  { path : '' , redirectTo : 'login' , pathMatch : 'full'},
  { path : 'login' , component:LoginComponent },
  { path : 'dashboard' , component:DashboardComponent },
  { path : 'nuevo' , component:NuevoComponent },
  { path : 'editar/:id' , component:EditarComponent },
  
  //rutas para encargados
  { path: 'encargados', component: EncargadosComponent },
  { path : 'editarEncargados/:id' , component:EditarEncargadosComponent },
  { path : 'nuevoEncargados' , component:NuevoEncargadosComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const rountingComponents = [LoginComponent,DashboardComponent,NuevoComponent,EditarComponent]

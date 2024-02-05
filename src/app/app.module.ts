import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule, rountingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './plantillas/header/header.component';
import { FooterComponent } from './plantillas/footer/footer.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { EncargadosComponent } from './vistas/encargados/encargados.component';
import { LoguotComponent } from './plantillas/loguot/loguot.component';
import { NuevoEncargadosComponent } from './vistas/nuevo-encargados/nuevo-encargados.component';
import { EditarEncargadosComponent } from './vistas/editar-encargados/editar-encargados.component';
import { AlumnosComponent } from './vistas/alumnos/alumnos.component';
import { EditarAlumnosComponent } from './vistas/editar-alumnos/editar-alumnos.component';
import { NuevoAlumnosComponent } from './vistas/nuevo-alumnos/nuevo-alumnos.component';
import { ProfesoresComponent } from './vistas/profesores/profesores.component';
import { EditarProfesoresComponent } from './vistas/editar-profesores/editar-profesores.component';
import { NuevoProfesoresComponent } from './vistas/nuevo-profesores/nuevo-profesores.component';
import { RecursosComponent } from './vistas/recursos/recursos.component';
import { EditarRecursosComponent } from './vistas/editar-recursos/editar-recursos.component';
import { NuevoRecursosComponent } from './vistas/nuevo-recursos/nuevo-recursos.component';
import { MenuComponent } from './plantillas/menu/menu.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    rountingComponents,
    EncargadosComponent,
    LoguotComponent,
    NuevoEncargadosComponent,
    EditarEncargadosComponent,
    AlumnosComponent,
    EditarAlumnosComponent,
    NuevoAlumnosComponent,
    ProfesoresComponent,
    EditarProfesoresComponent,
    NuevoProfesoresComponent,
    RecursosComponent,
    EditarRecursosComponent,
    NuevoRecursosComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    FormsModule,
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

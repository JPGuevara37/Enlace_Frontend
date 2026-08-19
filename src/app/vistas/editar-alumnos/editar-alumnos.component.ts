import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { IResponse } from '../../modelos/response.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { IAlumnos } from '../../modelos/alumnos.interfase';
import { IListaEcargados } from '../../modelos/listaencargados.interfase';
import { IListaEdades } from '../../modelos/listaedades.interfase';
import { IListaAlumnos } from '../../modelos/listaalumnos.interfase';
import { HeaderComponent } from '../../plantillas/header/header.component';
import { FooterComponent } from '../../plantillas/footer/footer.component';

@Component({
  selector: 'app-editar-alumnos',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './editar-alumnos.component.html',
  styleUrl: './editar-alumnos.component.css',
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'es' }]
})
export class EditarAlumnosComponent implements OnInit {

  alumnos: IListaAlumnos[] | undefined;
  encargados: IListaEcargados[] | undefined;
  edades: IListaEdades[] | undefined;
  filtroNombre: string = '';

  constructor(
    private activerouter: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private alertas: AlertasService
  ) {}

  datosAlumno: IAlumnos | undefined;

  editarForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    direccion: new FormControl(''),
    email: new FormControl(''),
    telefono: new FormControl(''),
    alumnoId: new FormControl(''),
    encargadoId: new FormControl(''),
    edadId: new FormControl(''),
  });

  ngOnInit(): void {
    let alumnoId = this.activerouter.snapshot.paramMap.get('id');
    this.api.getSingleAlumno(alumnoId).subscribe((data) => {
      this.datosAlumno = data;
      this.editarForm.setValue({
        nombre: this.datosAlumno.nombre ?? '',
        apellido: this.datosAlumno.apellido ?? '',
        fechaNacimiento: this.datosAlumno.fechaNacimiento ?? '',
        direccion: this.datosAlumno.direccion ?? '',
        email: this.datosAlumno.email ?? '',
        telefono: this.datosAlumno.telefono ?? '',
        alumnoId: this.datosAlumno.alumnoId ?? '',
        encargadoId: this.datosAlumno.encargadoId ?? '',
        edadId: this.datosAlumno.edadId ?? '',
      });
    });

    this.api.getAllEncargados(1).subscribe((data) => {
      this.encargados = data;
      this.filtrarEncargados();
    });

    this.api.getAllEdades(1).subscribe((data) => {
      this.edades = data;
    });
  }

  filtrarEncargados() {
    if (this.encargados && this.encargados.length > 0) {
      this.alumnos = this.alumnos?.map((alumno) => ({
        ...alumno,
        nombreEncargado: this.getNombreEncargado(alumno.encargadoId),
      }));
    }
  }

  postForm(form: any) {
    this.api.putAlumnos(form).subscribe((data) => {
      let respuesta: IResponse = data;
      if (respuesta.status == 'ok') {
        this.alertas.showSuccess('Datos modificados', 'Hecho');
      } else {
        this.alertas.showError(respuesta.result?.error_msj, 'Error');
      }
    });
  }

  delete() {
    let datos: any = this.editarForm.value;
    let isConfirmed = window.confirm('¿Estás seguro que quieres eliminar el usuario');

    if (isConfirmed) {
      this.api.deleteAlumnos(datos).subscribe((data) => {
        let respuesta: IResponse = data;
        if (respuesta.status == 'ok') {
          this.alertas.showSuccess('Datos eliminados', 'Hecho');
          this.router.navigate(['alumnos']);
        } else {
          this.alertas.showError(respuesta.result?.error_msj, 'Error');
        }
      });
    }
  }

  salir() {
    this.router.navigate(['alumnos']);
  }

  getNombreEncargado(encargadoId: string): string {
    const encargado = this.encargados?.find((e) => e.encargadoId === encargadoId);
    return encargado ? `${encargado.nombre} ${encargado.apellido}` : '';
  }
}

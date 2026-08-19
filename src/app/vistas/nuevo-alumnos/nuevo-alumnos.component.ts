import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IResponse } from '../../modelos/response.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { IListaEdades } from '../../modelos/listaedades.interfase';
import { IListaEcargados } from '../../modelos/listaencargados.interfase';

@Component({
  selector: 'app-nuevo-alumnos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './nuevo-alumnos.component.html',
  styleUrl: './nuevo-alumnos.component.css',
})
export class NuevoAlumnosComponent implements OnInit {
  encargados: IListaEcargados[] | undefined;
  edades: IListaEdades[] | undefined;

  nuevoForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    encargadoId: new FormControl(''),
    edadId: new FormControl(''),
  });

  constructor(
    private api: ApiService,
    private router: Router,
    private alertas: AlertasService,
  ) {}

  ngOnInit(): void {
    this.api.getAllEncargados(1).subscribe(data => {
      this.encargados = data;
    });

    this.api.getAllEdades(1).subscribe(data => {
      this.edades = data;
    });
  }

  postForm(form: any) {
    this.api.postAlumno(form).subscribe(data => {
      const respuesta: IResponse = data;
      if (respuesta.status == 'ok') {
        this.alertas.showSuccess('Nuevo alumno insertado', 'Hecho');
        this.router.navigate(['alumnos']);
      } else {
        this.alertas.showError(respuesta.result?.error_msj, 'Error');
      }
    });
  }

  salir() {
    this.router.navigate(['alumnos']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { IResponse } from '../../modelos/response.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { IProfesores } from '../../modelos/profesores.interfase';

@Component({
  selector: 'app-editar-profesores',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './editar-profesores.component.html',
  styleUrl: './editar-profesores.component.css'
})
export class EditarProfesoresComponent implements OnInit {

  constructor(
    private activerouter: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private alertas: AlertasService) {}

  datosProfesor: IProfesores | undefined;

  editarForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    email: new FormControl(''),
    telefono: new FormControl(''),
    profesorId: new FormControl(''),
  });

  ngOnInit(): void {
    let profesorId = this.activerouter.snapshot.paramMap.get('id');
    this.api.getSingleProfesor(profesorId).subscribe(data => {
      this.datosProfesor = data;
      this.editarForm.setValue({
        nombre: this.datosProfesor.nombre ?? '',
        apellido: this.datosProfesor.apellido ?? '',
        email: this.datosProfesor.email ?? '',
        telefono: this.datosProfesor.telefono ?? '',
        profesorId: this.datosProfesor.profesorId ?? '',
      });
    });
  }

  postForm(form: any) {
    this.api.putProfesores(form).subscribe(data => {
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
      this.api.deleteProfesor(datos).subscribe(data => {
        let respuesta: IResponse = data;
        if (respuesta.status == 'ok') {
          this.alertas.showSuccess('Datos eliminados', 'Hecho');
          this.router.navigate(['profesores']);
        } else {
          this.alertas.showError(respuesta.result?.error_msj, 'Error');
        }
      });
    }
  }

  salir() {
    this.router.navigate(['profesores']);
  }
}

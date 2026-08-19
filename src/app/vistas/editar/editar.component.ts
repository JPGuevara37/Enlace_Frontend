import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { IResponse } from '../../modelos/response.interfase';
import { IEncargado } from '../../modelos/encargado.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';

@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  constructor(
    private activerouter: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private alertas: AlertasService) {}

  datosEncargado: IEncargado | undefined;

  editarForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    direccion: new FormControl(''),
    email: new FormControl(''),
    telefono: new FormControl(''),
    encargadoId: new FormControl(''),
  });

  ngOnInit(): void {
    let encargadoId = this.activerouter.snapshot.paramMap.get('id');
    this.api.getSingleEncargado(encargadoId).subscribe(data => {
      this.datosEncargado = data;
      this.editarForm.setValue({
        nombre: this.datosEncargado.nombre ?? '',
        apellido: this.datosEncargado.apellido ?? '',
        direccion: this.datosEncargado.direccion ?? '',
        email: this.datosEncargado.email ?? '',
        telefono: this.datosEncargado.telefono ?? '',
        encargadoId: this.datosEncargado.encargadoId ?? '',
      });
    });
  }

  postForm(form: any) {
    this.api.putEncargado(form).subscribe(data => {
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
      this.api.deleteEncargado(datos).subscribe(data => {
        let respuesta: IResponse = data;
        if (respuesta.status == 'ok') {
          this.alertas.showSuccess('Datos eliminados', 'Hecho');
          this.router.navigate(['encargados']);
        } else {
          this.alertas.showError(respuesta.result?.error_msj, 'Error');
        }
      });
    }
  }

  salir() {
    this.router.navigate(['encargados']);
  }
}

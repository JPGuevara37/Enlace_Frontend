import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IResponse } from '../../modelos/response.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';

@Component({
  selector: 'app-nuevo-recursos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './nuevo-recursos.component.html',
  styleUrl: './nuevo-recursos.component.css'
})
export class NuevoRecursosComponent implements OnInit {

  nuevoForm = new FormGroup({
    articulo: new FormControl(''),
    cantidad: new FormControl(''),
    numero_Locker: new FormControl(''),
    descripcion: new FormControl(''),
    activo: new FormControl(true),
  });

  constructor(private api: ApiService, private router: Router, private alertas: AlertasService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      let token = localStorage.getItem('token');
      if (token) {
        this.nuevoForm.patchValue({});
      }
    } else {
      console.warn('No se puede acceder a localStorage en este entorno.');
    }
  }

  postForm(form: any) {
    const payload = {
      articulo: form.articulo,
      cantidad: form.cantidad ? Number(form.cantidad) : undefined,
      numero_Locker: form.numero_Locker ? Number(form.numero_Locker) : 0,
      descripcion: form.descripcion,
      activo: !!form.activo,
    };
    this.api.postRecurso(payload).subscribe(data => {
      let respuesta: IResponse = data;
      if (respuesta.status == 'ok') {
        this.alertas.showSuccess('Nuevo material insertado', 'Hecho');
        this.router.navigate(['recursos']);
      } else {
        this.alertas.showError(respuesta.result?.error_msj, 'Error');
      }
    });
  }

  salir() {
    this.router.navigate(['recursos']);
  }
}

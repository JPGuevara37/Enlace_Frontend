import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { IResponse } from '../../modelos/response.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { IRecursos } from '../../modelos/recursos.interfase';

const CLASES = ['Legado', 'Aspirantes', 'Retoñitos', 'Pampanitos', 'Semillitas'];

@Component({
  selector: 'app-editar-recursos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './editar-recursos.component.html',
  styleUrl: './editar-recursos.component.css'
})
export class EditarRecursosComponent implements OnInit {

  clases = CLASES;

  constructor(
    private activerouter: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private alertas: AlertasService) {}

  datosRecursos: IRecursos | undefined;

  editarForm = new FormGroup({
    articulo: new FormControl(''),
    activo: new FormControl(false),
    cantidad: new FormControl(''),
    numero_Locker: new FormControl(''),
    descripcion: new FormControl(''),
    categoria: new FormControl(''),
    recursosId: new FormControl(''),
  });

  ngOnInit(): void {
    let recursosId = this.activerouter.snapshot.paramMap.get('id');
    this.api.getSingleRecurso(recursosId).subscribe(data => {
      this.datosRecursos = data;
      this.editarForm.setValue({
        articulo: this.datosRecursos.articulo ?? '',
        activo: !!this.datosRecursos.activo,
        cantidad: this.datosRecursos.cantidad?.toString() ?? '',
        numero_Locker: this.datosRecursos.numero_Locker?.toString() ?? '',
        descripcion: this.datosRecursos.descripcion ?? '',
        categoria: this.datosRecursos.categoria ?? '',
        recursosId: this.datosRecursos.recursosId ?? '',
      });
    });
  }

  postForm(form: any) {
    const payload = {
      recursosId: form.recursosId,
      articulo: form.articulo,
      cantidad: form.cantidad ? Number(form.cantidad) : undefined,
      numero_Locker: form.numero_Locker ? Number(form.numero_Locker) : 0,
      descripcion: form.descripcion,
      categoria: form.categoria,
      activo: !!form.activo,
    };
    this.api.putRecursos(payload).subscribe(data => {
      let respuesta: IResponse = data;
      if (respuesta.status == 'ok') {
        this.alertas.showSuccess('Datos modificados', 'Hecho');
        this.router.navigate(['recursos']);
      } else {
        this.alertas.showError(respuesta.result?.error_msj, 'Error');
      }
    });
  }

  delete() {
    let datos: any = this.editarForm.value;
    let isConfirmed = window.confirm('¿Estás seguro que quieres eliminar el articulo');

    if (isConfirmed) {
      this.api.deleteRecurso(datos).subscribe(data => {
        let respuesta: IResponse = data;
        if (respuesta.status == 'ok') {
          this.alertas.showSuccess('Datos eliminados', 'Hecho');
          this.router.navigate(['recursos']);
        } else {
          this.alertas.showError(respuesta.result?.error_msj, 'Error');
        }
      });
    }
  }

  salir() {
    this.router.navigate(['recursos']);
  }
}

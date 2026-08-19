import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { IResponse } from '../../modelos/response.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { IRecursos } from '../../modelos/recursos.interfase';
import { HeaderComponent } from '../../plantillas/header/header.component';
import { FooterComponent } from '../../plantillas/footer/footer.component';

@Component({
  selector: 'app-editar-recursos',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './editar-recursos.component.html',
  styleUrl: './editar-recursos.component.css'
})
export class EditarRecursosComponent implements OnInit {

  constructor(
    private activerouter: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private alertas: AlertasService) {}

  datosRecursos: IRecursos | undefined;

  editarForm = new FormGroup({
    articulo: new FormControl(''),
    activo: new FormControl(''),
    cantidad: new FormControl(''),
    numero_Locker: new FormControl(''),
    descripcion: new FormControl(''),
    recursosId: new FormControl(''),
  });

  ngOnInit(): void {
    let recursosId = this.activerouter.snapshot.paramMap.get('id');
    this.api.getSingleRecurso(recursosId).subscribe(data => {
      this.datosRecursos = data;
      this.editarForm.setValue({
        articulo: this.datosRecursos.articulo ?? '',
        activo: this.datosRecursos.activo?.toString() ?? '',
        cantidad: this.datosRecursos.cantidad?.toString() ?? '',
        numero_Locker: this.datosRecursos.numero_Locker?.toString() ?? '',
        descripcion: this.datosRecursos.descripcion ?? '',
        recursosId: this.datosRecursos.recursosId ?? '',
      });
    });
  }

  postForm(form: any) {
    this.api.putRecursos(form).subscribe(data => {
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

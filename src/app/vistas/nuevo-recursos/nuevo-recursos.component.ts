import { Component } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { IResponse } from '../../modelos/response.interfase';
import { IEncargado } from '../../modelos/encargado.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IRecursos } from '../../modelos/recursos.interfase';

@Component({
  selector: 'app-nuevo-recursos',
  templateUrl: './nuevo-recursos.component.html',
  styleUrl: './nuevo-recursos.component.css'
})
export class NuevoRecursosComponent {

  nuevoForm = new FormGroup({
    articulo: new FormControl(''),
    cantidad: new FormControl(''),
    numero_Locker: new FormControl(''),
    descripcion: new FormControl(''),
    activo: new FormControl(''),
    token: new FormControl(''),
    //encargadoId: new FormControl('')
});

  constructor(private api:ApiService, private router:Router, private alertas:AlertasService){}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      let token = localStorage.getItem('token');
      if (token) {
        this.nuevoForm.patchValue({
          'token': token
        });
      }
    } else {
      console.warn('No se puede acceder a localStorage en este entorno.');
    }
  }

  postForm(form:IRecursos){
    this.api.postRecurso(form).subscribe( data => {
      let respuesta : IResponse = data;
      console.log(data)
      if(respuesta.status == "ok"){
        this.alertas.showSuccess('Nuevo recurso insertado','Hecho')
        this.router.navigate(['recursos']);
      }else{
        this.alertas.showError(respuesta.result?.error_msj,'Error');
      }
    })

  }

  salir(){
    this.router.navigate(['encargados']);
  }

}

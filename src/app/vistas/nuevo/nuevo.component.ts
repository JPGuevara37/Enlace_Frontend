import { Component } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { IResponse } from '../../modelos/response.interfase';
import { IEncargado } from '../../modelos/encargado.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent {

  nuevoForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    direccion: new FormControl(''),
    email: new FormControl(''),
    telefono: new FormControl(''),
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

  postForm(form:IEncargado){
    this.api.postEncargado(form).subscribe( data => {
      let respuesta : IResponse = data;
      console.log(data)
      if(respuesta.status == "ok"){
        this.alertas.showSuccess('Nuevo encargado insertado','Hecho')
      }else{
        this.alertas.showError(respuesta.result?.error_msj,'Error');
      }
    })

  }

  salir(){
    this.router.navigate(['dashboard']);
  }

}

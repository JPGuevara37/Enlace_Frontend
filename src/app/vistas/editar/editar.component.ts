import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IResponse } from '../../modelos/response.interfase';
import { IEncargado } from '../../modelos/encargado.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { FormGroup,FormControl,Validators } from '@angular/forms';


@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})

export class EditarComponent implements OnInit{

  constructor(private activerouter:ActivatedRoute, private router:Router, private api:ApiService, private alertas:AlertasService){ }

  datosEncargado:IEncargado | undefined;

  editarForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    direccion: new FormControl(''),
    email: new FormControl(''),
    telefono: new FormControl(''),
    //token: new FormControl(''),
    encargadoId: new FormControl('')
});

  ngOnInit(): void {
    let encargadoId = this.activerouter.snapshot.paramMap.get('id');
    let token = this.getToken();
    this.api.getSingleEncargado(encargadoId).subscribe(data => {
        this.datosEncargado = data;
        this.editarForm.setValue({
          'nombre': this.datosEncargado.nombre ?? '',
          'apellido': this.datosEncargado.apellido ?? '',
          'direccion': this.datosEncargado.direccion ?? '',
          'email': this.datosEncargado.email ?? '',
          'telefono': this.datosEncargado.telefono ?? '',
          //'token': token ?? '',
          'encargadoId': this.datosEncargado.encargadoId ?? ''
        })
    })
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    } else {
      // Manejar el caso cuando localStorage no está disponible
      return null;
    }
  }
  
  postForm(form: IEncargado) {

    this.api.putEncargado(form).subscribe( data =>{
      let respuesta : IResponse = data;
      console.log(data)
      if(respuesta.status == "ok"){
        this.alertas.showSuccess('Datos modificados','Hecho')
      }else{
        this.alertas.showError(respuesta.result?.error_msj,'Error');
      }
    })
  }

  delete(){
    let datos:IEncargado = this.editarForm.value;
    this.api.deleteEncargado(datos).subscribe( data =>{
      let respuesta : IResponse = data;
      if(respuesta.status == "ok"){
        this.alertas.showSuccess('Datos eliminados','Hecho')
        this.router.navigate(['encargados']);
      }else{
        this.alertas.showError(respuesta.result?.error_msj,'Error');
      }
    })
  }

  salir(){
    this.router.navigate(['dashboard']);
  }

}



import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IResponse } from '../../modelos/response.interfase';
import { IEncargado } from '../../modelos/encargado.interfase';
import { AlertasService } from '../../Servicios/alertas/alertas.service';
import { ApiService } from '../../Servicios/api/api.service';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { IRecursos } from '../../modelos/recursos.interfase';

@Component({
  selector: 'app-editar-recursos',
  templateUrl: './editar-recursos.component.html',
  styleUrl: './editar-recursos.component.css'
})
export class EditarRecursosComponent {

  constructor(private activerouter:ActivatedRoute, private router:Router, private api:ApiService, private alertas:AlertasService){ }

  datosRecursos:IRecursos | undefined;

  editarForm = new FormGroup({
    articulo: new FormControl(''),
    activo: new FormControl(''),
    cantidad: new FormControl(''),
    numero_Locker: new FormControl(''),
    descripcion: new FormControl(''),
    //token: new FormControl(''),
    recursosId: new FormControl('')
});

  ngOnInit(): void {
    let recursosId = this.activerouter.snapshot.paramMap.get('id');
    let token = this.getToken();
    this.api.getSingleRecurso(recursosId).subscribe(data => {
        this.datosRecursos = data;
        this.editarForm.setValue({
          'articulo': this.datosRecursos.articulo ?? '',
          'activo': this.datosRecursos.activo ?? '',
          'cantidad': this.datosRecursos.cantidad ?? '',
          'numero_Locker': this.datosRecursos.numero_Locker ?? '',
          'descripcion': this.datosRecursos.descripcion ?? '',
          //'token': token ?? '',
          'recursosId': this.datosRecursos.recursosId ?? ''
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
  
  postForm(form: IRecursos) {

    this.api.putRecursos(form).subscribe( data =>{
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
    let datos:IRecursos = this.editarForm.value;
    let isConfirmed = window.confirm('¿Estás seguro que quieres eliminar el articulo')

    if (isConfirmed) {
      this.api.deleteRecurso(datos).subscribe( data =>{
      let respuesta : IResponse = data;
        if(respuesta.status == "ok"){
          this.alertas.showSuccess('Datos eliminados','Hecho')
          this.router.navigate(['recursos']);
        }else{
          this.alertas.showError(respuesta.result?.error_msj,'Error');
        }
      })
    }
  }

  salir(){
    this.router.navigate(['recursos']);
  }

}


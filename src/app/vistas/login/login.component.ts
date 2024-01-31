import { Component } from '@angular/core';

import { FormGroup,FormControl,Validators } from '@angular/forms';
import { ApiService } from '../../Servicios/api/api.service';
import { ILogin } from '../../modelos/login.interfase';
import { IResponse } from '../../modelos/response.interfase';

import { Route } from '@angular/router'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  loginForm = new FormGroup({
    usuario : new FormControl('',Validators.required),
    password : new FormControl('',Validators.required)
  })

  constructor(private api:ApiService, private router: Router) {}

  errorStatus:boolean = false;
  errorMsj:any = "";
  

  ngOnInit() : void {
    this.checkLocalStorage();
  }

  checkLocalStorage() {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('token')) {
      this.router.navigate(['dashboard']);
    }
  }
  

  onLogin(form:ILogin){
    this.api.LoginByEmail(form).subscribe(data =>{
      let dataResponse:IResponse = data;
      console.log(dataResponse);
      if(dataResponse.status === "ok" && dataResponse.result){
        localStorage.setItem("token", dataResponse.result.token);
        this.router.navigate(['dashboard']);
      }
      else if (dataResponse.result?.error_msj){
        this.errorStatus = true;
        this.errorMsj = dataResponse.result.error_msj;
        
      }
      
    });
  }

}

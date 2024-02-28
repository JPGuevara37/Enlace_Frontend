import { Component } from '@angular/core';

import { FormGroup,FormControl,Validators, FormBuilder, Validator } from '@angular/forms';
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

  type:string = "password"
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash"
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private api:ApiService, private router: Router) {}

  ngOnInit() : void {
    this.loginForm = this.fb.group({
      username : ['',Validators.required],
      password : ['',Validators.required]
    })
  }

  hideshowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onSumit(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value)
    }else{

      this.validateAllFormFileds(this.loginForm);
      alert("Tu form es invalido")
    }
  }

  private validateAllFormFileds(FormGroup:FormGroup){
    Object.keys(FormGroup.controls).forEach(field=>{
      const control = FormGroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf:true});
      } else if(control instanceof FormGroup){
        this.validateAllFormFileds(control)
      }
    })
  }
}

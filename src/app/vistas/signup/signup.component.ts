import { Component, OnInit } from '@angular/core';

import { FormGroup,FormControl,Validators, FormBuilder, Validator } from '@angular/forms';
import { ApiService } from '../../Servicios/api/api.service';
import { ILogin } from '../../modelos/login.interfase';
import { IResponse } from '../../modelos/response.interfase';

import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})

export class SignupComponent implements OnInit{


  type:string = "password"
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash"
  signUpForm!: FormGroup;

constructor(private fb: FormBuilder, private api:ApiService, private router: Router){}


  ngOnInit(): void {
   this.signUpForm =  this.fb.group({
    Nombre: ['', Validators.required],
    Apellido: ['', Validators.required],
    Usuario_Cuenta: ['', Validators.required],
    Email: ['', Validators.required],
    Password: ['', Validators.required],
   })
  }

  hideshowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onSignup(){
    if(this.signUpForm.valid){
      console.log(this.signUpForm.value)

      this.api.singUP(this.signUpForm.value).subscribe({
        next:(res =>{
          alert(res.message)
          this.signUpForm.reset();
          this.router.navigate(['login'])
      }),
        error:(err =>{
          alert(err?.error.message)
        })
      })

    }else{
      this.validateAllFormFileds(this.signUpForm);
    }
  }

  private validateAllFormFileds(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach(field=>{
      const control = formGroup.get(field);
      if (control instanceof FormControl){
        control.markAsDirty({onlySelf:true});
      } else if(control instanceof FormGroup){
        this.validateAllFormFileds(control)
      }
    })
  }
}

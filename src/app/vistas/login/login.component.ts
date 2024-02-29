import { Component } from '@angular/core';

import { FormGroup,FormControl,Validators, FormBuilder, Validator } from '@angular/forms';
import { ApiService } from '../../Servicios/api/api.service';
import { ILogin } from '../../modelos/login.interfase';
import { IResponse } from '../../modelos/response.interfase';

import { Route } from '@angular/router'; 
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

import { Input } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fallingConfeti', [
      state('start', style({ opacity: 0, transform: 'translateY(-100vh)' })),
      state('end', style({ opacity: 1, transform: 'translateY(100vh)' })),
      transition('start => end', animate('3000ms', keyframes([
        style({ opacity: 0, transform: 'translateY(-100vh)', offset: 0 }),
        style({ opacity: 1, transform: 'translateY(50vh)', offset: 0.5 }),
        style({ opacity: 1, transform: 'translateY(100vh)', offset: 1 }),
      ]))),
    ]),
  ],
})

export class LoginComponent {

  @Input() confetiState: string = 'start';

  type:string = "password"
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash"
  loginForm!: FormGroup;
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;

  constructor(
    private fb: FormBuilder, 
    private api:ApiService, 
    private router: Router,
    private toast: NgToastService
    ){}

  ngOnInit() : void {
    this.loginForm = this.fb.group({
      Usuario_Cuenta: ['',Validators.required],
      Password: ['',Validators.required]
    })
  }

  hideshowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onLogin(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value)

      this.api.login(this.loginForm.value).subscribe({
        next:(res) =>{
          alert(res.message);
          this.loginForm.reset();
          this.api.storeToken(res.token);
          this.toast.success({detail:"Acceso permitido", summary:res.message, duration: 5000});
          this.confetiState = 'end';
          this.router.navigate(['dashboard'])
        },
        error:(err) =>{
          this.toast.error({detail:"Error", summary:"Algo salió mal!!!", duration: 5000});
        }
      });

    }else{

      this.validateAllFormFileds(this.loginForm);
      alert("Tu form es invalido")
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

  checkValidEmail(event: string){
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend(){
    if(this.checkValidEmail(this.resetPasswordEmail))
    console.log(this.resetPasswordEmail);

    

  }
}


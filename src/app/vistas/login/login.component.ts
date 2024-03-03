import { Component } from '@angular/core';

import { FormGroup,FormControl,Validators, FormBuilder, Validator } from '@angular/forms';
import { ApiService } from '../../Servicios/api/api.service';
import { LoguotComponent } from '../../plantillas/loguot/loguot.component';

import { ILogin } from '../../modelos/login.interfase';
import { IResponse } from '../../modelos/response.interfase';

import { Route } from '@angular/router'; 
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

import { Input } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { ResetPassword } from '../../modelos/resetPassword.interfase';
import { error } from 'console';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],

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
    private toast: NgToastService,
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

  onLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
  
      this.api.login(this.loginForm.value).subscribe({
        next: (res) => {
          alert(res.message);
  
          // Almacenar el token en localStorage
          this.api.storeToken(res.token);
  
          // Establecer la fecha de expiración del token en localStorage
          const expirationDate = new Date(new Date().getTime() + 60 * 60 * 1000); // 60 minutos
          window.localStorage.setItem('tokenExpiration', expirationDate.toLocaleString());
  
          console.log('Token expiration set:', expirationDate.toLocaleString());
  
          this.loginForm.reset();
          this.toast.success({ detail: "Acceso permitido", summary: res.message, duration: 5000 });
          this.router.navigate(['dashboard']);
        },
        error: (err) => {
          this.toast.error({ detail: "Error", summary: "Algo salió mal!!!", duration: 5000 });
        }
      });
  
    } else {
      this.validateAllFormFileds(this.loginForm);
      alert("Tu formulario es inválido");
    }
  
    // Imprimir información relevante en la consola
    console.log('Token expiration in localStorage:', localStorage.getItem('tokenExpiration'));
    console.log('Is token expired?', this.api.isTokenExpired());
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

  confirmToSend() {
    if (this.checkValidEmail(this.resetPasswordEmail)) {
       console.log('Sending reset password link for email:', this.resetPasswordEmail);
 
       this.api.sendResetPasswordLink(this.resetPasswordEmail)
          .subscribe({
             next: (res: any) => {
                console.log('Reset password link sent successfully:', res);
                this.toast.success({
                   detail: 'Restablecimiento exitoso',
                   summary: 'Restablecimiento exitoso',
                   duration: 3000,
                });
                this.resetPasswordEmail = "";
                const buttonRef = document.getElementById("closeBtn");
                buttonRef?.click();
             },
             error: (err: any) => {
              console.error('Error sending reset password link:', err);
                this.toast.error({
                   detail: 'Algo Salio mal',
                   summary: 'Error',
                   duration: 3000,
                });
             }
          });
      }
  }
}

  /*isTokenExpired(): boolean {
    if (typeof localStorage === 'undefined') {
      return true; // Tratar como token expirado si localStorage no está definido
    }

    const tokenExpirationString = localStorage.getItem('tokenExpiration');
  
    if (!tokenExpirationString) {
      // No hay fecha de expiración almacenada, el token se considera expirado
      return true;
    }
  
    const tokenExpiration = new Date(tokenExpirationString);
    const currentDateTime = new Date();
  
    // Verificar si la fecha de expiración es anterior a la fecha y hora actuales
    return tokenExpiration < currentDateTime;
  }*/




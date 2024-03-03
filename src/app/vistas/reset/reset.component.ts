import { Component, OnInit } from '@angular/core';

import { FormGroup,FormControl,Validators, FormBuilder, Validator } from '@angular/forms';
import { ApiService } from '../../Servicios/api/api.service';

import { ActivatedRoute, Router } from '@angular/router';
import { ResetPassword } from '../../modelos/resetPassword.interfase';
import { ConfirmPasswordValidator } from '../../../../helpers/confirm-password-validator';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css'
})
export class ResetComponent implements OnInit{

  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();

  constructor (private fb: FormBuilder, 
    private router : Router,
    private acticateRoute : ActivatedRoute, 
    private api: ApiService, 
    private toast: NgToastService){}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword:[ null, Validators.required]
    },{
      Validator: ConfirmPasswordValidator("password","confirmPassword")
    });

    this.acticateRoute.queryParams.subscribe(val => {
      this.emailToReset = val['email'];
      let uriToken = val['code'];
      this.emailToken = uriToken.replace(/ /g,'+');
    })
  }

  reset(){
    if (this.resetPasswordForm.valid){
      this.resetPasswordObj.email = this.emailToReset
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.emailToken = this.emailToken

      this.api.resetPassword(this.resetPasswordObj)
      .subscribe({
        next:(res) =>{
          this.toast.success({
            detail: 'Hecho',
            summary: "Contrasena restablecida",
            duration: 3000,
          });
          this.router.navigate(['/'])

        },
        error:(err) =>{
          this.toast.error({
            detail: 'ERROR',
            summary: "Algo Salio mal",
            duration: 3000,
        });
      }
    })
    }else{
    }
  }

validateAllFormFields(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach((field) => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      this.validateAllFormFields(control);
    }
  });
}
}



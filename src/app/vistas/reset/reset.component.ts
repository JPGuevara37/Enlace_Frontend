import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../../Servicios/api/api.service';
import { ResetPassword } from '../../modelos/resetPassword.interfase';
import { ConfirmPasswordValidator } from '../../../../helpers/confirm-password-validator';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css'
})
export class ResetComponent implements OnInit {

  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();
  enlaceInvalido = false;
  enviando = false;

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private acticateRoute: ActivatedRoute,
    private api: ApiService,
    private toast: NgToastService) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, Validators.required],
    }, {
      validators: ConfirmPasswordValidator('password', 'confirmPassword'),
    });

    this.acticateRoute.queryParams.subscribe(val => {
      this.emailToReset = val['email'] ?? '';
      const uriToken = val['code'] ?? '';
      this.emailToken = uriToken ? uriToken.replace(/ /g, '+') : '';
      this.enlaceInvalido = !this.emailToReset || !this.emailToken;
    });
  }

  hideshowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash';
    this.isText ? this.type = 'text' : this.type = 'password';
  }

  reset() {
    if (!this.resetPasswordForm.valid) {
      this.validateAllFormFields(this.resetPasswordForm);
      return;
    }

    this.enviando = true;
    this.resetPasswordObj.email = this.emailToReset;
    this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
    this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
    this.resetPasswordObj.emailToken = this.emailToken;

    this.api.resetPassword(this.resetPasswordObj)
      .subscribe({
        next: (res: any) => {
          this.enviando = false;
          this.toast.success({
            detail: 'Contraseña restablecida',
            summary: res?.message ?? 'Ya puedes iniciar sesión con tu nueva contraseña',
            duration: 3000,
          });
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          this.enviando = false;
          const mensaje = err?.error?.message || 'No se pudo restablecer la contraseña';
          this.toast.error({ detail: 'Error', summary: mensaje, duration: 4000 });
        }
      });
  }

  irAlLogin() {
    this.router.navigate(['/']);
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

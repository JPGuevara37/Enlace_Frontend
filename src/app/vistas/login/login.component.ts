import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../Servicios/api/api.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  loginForm!: FormGroup;
  resetPasswordEmail!: string;
  isValidEmail!: boolean;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private toast: NgToastService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      Usuario_Cuenta: ['', Validators.required],
      Password: ['', Validators.required],
    });
  }

  hideshowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash';
    this.isText ? this.type = 'text' : this.type = 'password';
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.api.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.api.storeToken(res.token);
          const expirationDate = new Date(new Date().getTime() + 60 * 60 * 1000);
          window.localStorage.setItem('tokenExpiration', expirationDate.toISOString());
          window.localStorage.setItem('cuenta', this.loginForm.value.Usuario_Cuenta || '');
          this.loginForm.reset();
          this.toast.success({ detail: 'Acceso permitido', summary: res.message ?? 'Login exitoso', duration: 1000 });
          this.router.navigate(['home']);
        },
        error: () => {}
      });
    } else {
      this.validateAllFormFileds(this.loginForm);
      alert('Tu formulario es inválido');
    }
  }

  private validateAllFormFileds(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFileds(control);
      }
    });
  }

  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend() {
    if (this.checkValidEmail(this.resetPasswordEmail)) {
      this.api.sendResetPasswordLink(this.resetPasswordEmail)
        .subscribe({
          next: () => {
            this.resetPasswordEmail = '';
            const buttonRef = document.getElementById('closeBtn');
            buttonRef?.click();
          },
          error: () => {}
        });
    }
  }
}

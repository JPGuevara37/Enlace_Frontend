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
          window.localStorage.setItem('nombre', res.nombre || '');
          window.localStorage.setItem('apellido', res.apellido || '');
          window.localStorage.setItem('avatar', res.avatar || '');
          this.loginForm.reset();
          this.toast.success({ detail: 'Acceso permitido', summary: res.message ?? 'Login exitoso', duration: 1000 });
          this.router.navigate(['home']);
        },
        error: (err) => {
          const mensaje = err?.error?.message || 'Usuario o contraseña incorrectos';
          this.toast.error({ detail: 'Acceso denegado', summary: mensaje, duration: 3000 });
        }
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
}

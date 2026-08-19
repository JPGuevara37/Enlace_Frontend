import { Injectable, inject } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  private toast = inject(NgToastService);

  showSuccess(texto: string | undefined, titulo: string | undefined) {
    this.toast.success({ detail: titulo ?? '', summary: texto ?? '', duration: 5000 });
  }

  showError(texto: string | undefined, titulo: string | undefined) {
    this.toast.error({ detail: titulo ?? '', summary: texto ?? '', duration: 5000 });
  }
}

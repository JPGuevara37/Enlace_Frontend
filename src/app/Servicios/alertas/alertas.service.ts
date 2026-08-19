import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertasService {
  showSuccess(_texto?: string, _titulo?: string): void {}

  showError(_texto?: string, _titulo?: string): void {}
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RuntimeConfigService {
  private http = inject(HttpClient);
  apiUrl = 'https://api-enlace.azurewebsites.net';

  async load(): Promise<void> {
    try {
      const cfg = await firstValueFrom(
        this.http.get<{ apiUrl?: string }>('/assets/config.json'),
      );
      if (cfg?.apiUrl) {
        this.apiUrl = cfg.apiUrl.replace(/\/+$/, '');
      }
    } catch {
      // conserva el default
    }
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RuntimeConfigService {
  private http = inject(HttpClient);
  apiUrl = 'https://enlace-api.jifftry.com';

  async load(): Promise<void> {
    try {
      const cfg = await firstValueFrom(
        this.http.get<{ apiUrl?: string }>('/assets/config.json', {
          params: { v: Date.now().toString() },
        }),
      );
      if (cfg?.apiUrl) {
        this.apiUrl = cfg.apiUrl.replace(/\/+$/, '');
      }
    } catch {
      // conserva el default
    }
  }
}

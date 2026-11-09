import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactPayload } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/contact';

  sendMessage(payload: ContactPayload): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(this.endpoint, payload);
  }
}


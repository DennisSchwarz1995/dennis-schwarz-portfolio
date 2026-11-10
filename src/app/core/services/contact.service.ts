import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactPayload } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/contact';

  /** Increments whenever the header CTA requests a visual highlight on the contact inputs */
  readonly highlightSequence = signal(0);

  sendMessage(payload: ContactPayload): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(this.endpoint, payload);
  }

  triggerInputHighlight(): void {
    this.highlightSequence.update((v) => v + 1);
  }
}


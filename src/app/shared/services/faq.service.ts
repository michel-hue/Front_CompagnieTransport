import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { Params } from '../interface/core.interface';
import { IFaqModel } from '../interface/faq.interface';

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  private http = inject(HttpClient);

  getFaqs(payload?: Params): Observable<IFaqModel> {
    return this.http.get<IFaqModel>(`${URL}/faq.json`, { params: payload });
  }
}

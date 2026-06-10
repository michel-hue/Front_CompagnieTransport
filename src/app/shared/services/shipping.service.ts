import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { Params } from '../interface/core.interface';
import { IShipping } from '../interface/shipping.interface';

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  private http = inject(HttpClient);

  getShippings(payload?: Params): Observable<IShipping[]> {
    return this.http.get<IShipping[]>(`${URL}/shipping.json`, { params: payload });
  }
}

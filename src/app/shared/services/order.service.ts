import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';


import { Params } from '../interface/core.interface';
import { IOrderModel } from '../interface/order.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);

  getOrders(payload?: Params): Observable<IOrderModel> {
    return this.http.get<IOrderModel>(`${URL}/order.json`, { params: payload });
  }
}

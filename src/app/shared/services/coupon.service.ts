import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { Params } from '../interface/core.interface';
import { ICouponModel } from '../interface/coupon.interface';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private http = inject(HttpClient);

  getCoupons(payload?: Params): Observable<ICouponModel> {
    return this.http.get<ICouponModel>(`${URL}/coupon.json`, { params: payload });
  }
}

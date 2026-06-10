import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';


import { ICommissionModel } from '../interface/commission.interface';
import { Params } from '../interface/core.interface';

@Injectable({
  providedIn: 'root',
})
export class CommissionService {
  private http = inject(HttpClient);

  getCommissionHistory(payload?: Params): Observable<ICommissionModel> {
    return this.http.get<ICommissionModel>(`${URL}/commission.json`, {
      params: payload,
    });
  }
}

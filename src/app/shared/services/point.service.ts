import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';


import { Params } from '../interface/core.interface';
import { IPoint } from '../interface/point.interface';

@Injectable({
  providedIn: 'root',
})
export class PointService {
  private http = inject(HttpClient);

  getUserTransaction(payload?: Params): Observable<IPoint> {
    return this.http.get<IPoint>(`${URL}/point.json`, { params: payload });
  }
}

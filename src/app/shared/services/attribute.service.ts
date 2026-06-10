import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';


import { IAttributeModel, AttributeValueModel } from '../interface/attribute.interface';
import { Params } from '../interface/core.interface';

@Injectable({
  providedIn: 'root',
})
export class AttributeService {
  private http = inject(HttpClient);

  getAttributes(payload?: Params): Observable<IAttributeModel> {
    return this.http.get<IAttributeModel>(`${URL}/attribute.json`, { params: payload });
  }

  getAttributeValues(payload?: Params): Observable<AttributeValueModel> {
    return this.http.get<AttributeValueModel>(`${URL}/attribute-value.json`, {
      params: payload,
    });
  }
}

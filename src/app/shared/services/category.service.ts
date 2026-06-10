import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ICategoryModel } from '../interface/category.interface';
import { Params } from '../interface/core.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);

  getCategories(payload?: Params): Observable<ICategoryModel> {
    return this.http.get<ICategoryModel>(`${URL}/category.json`, { params: payload });
  }
}

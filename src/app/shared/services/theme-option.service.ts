import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';


import { IThemeOption } from '../interface/theme-option.interface';

@Injectable({
  providedIn: 'root',
})
export class ThemeOptionService {
  private http = inject(HttpClient);

  getThemeOption(): Observable<IThemeOption> {
    return this.http.get<IThemeOption>(`${URL}/theme-option.json`);
  }
}

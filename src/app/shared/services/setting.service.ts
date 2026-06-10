import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';


import { ISetting } from '../interface/setting.interface';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  private http = inject(HttpClient);

  getSettingOption(): Observable<ISetting> {
    return this.http.get<ISetting>(`${URL}/setting.json`);
  }

  getBackendSettingOption(): Observable<ISetting> {
    return this.http.get<ISetting>(`${URL}/setting.json`);
  }
}

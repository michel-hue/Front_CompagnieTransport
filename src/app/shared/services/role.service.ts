import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';


import { Params } from '../interface/core.interface';
import { IModule, IRoleModel } from '../interface/role.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private http = inject(HttpClient);

  getRoleModules(): Observable<IModule[]> {
    return this.http.get<IModule[]>(`${URL}/module.json`);
  }

  getRoles(payload?: Params): Observable<IRoleModel> {
    return this.http.get<IRoleModel>(`${URL}/role.json`, { params: payload });
  }
}

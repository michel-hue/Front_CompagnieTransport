import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { Params } from '../interface/core.interface';
import { IUserModel } from '../interface/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  getUsers(payload?: Params): Observable<IUserModel> {
    return this.http.get<IUserModel>(`${URL}/user.json`, { params: payload });
  }
}

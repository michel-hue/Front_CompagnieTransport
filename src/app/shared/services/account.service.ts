import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';


import { IAccountUser } from '../interface/account.interface';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);

  getUserDetails(): Observable<IAccountUser> {
    return this.http.get<IAccountUser>(`${URL}/account.json`);
  }
}

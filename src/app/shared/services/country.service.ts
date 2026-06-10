import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ICountry } from '../interface/country.interface';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);

  getCountries(): Observable<ICountry[]> {
    return this.http.get<ICountry[]>(`${URL}/country.json`);
  }
}

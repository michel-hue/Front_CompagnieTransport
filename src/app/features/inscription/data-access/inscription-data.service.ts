import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../tools/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InscriptionDataService {
  private apiService = inject(ApiService);

  registerVendor(payload: FormData): Observable<any> {
    return this.apiService.postWithParams('public/vendors/register', payload);
  }
}


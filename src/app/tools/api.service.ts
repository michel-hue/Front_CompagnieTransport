/*
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../src/environments/environment';
import { LocalStorageService } from './local-storage.service';
import { httpJsonResponse, DataResponse } from './models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private httpClient = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);

  // Les headers et le token sont gérés automatiquement par l'intercepteur HTTP
  // Plus besoin de configurer manuellement les headers ici

  /!**
   * Gestion centralisée des erreurs HTTP
   *!/
  private handleError = (error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client ou réseau
      console.error('Une erreur est survenue:', error.error.message);
    } else {
      // Le backend a retourné un code d'erreur
      console.error(`Code d'erreur ${error.status}, ` + `body: ${JSON.stringify(error.error)}`);

      // Gestion de l'expiration du token
      if (error.status === 401) {
        this.localStorageService.removeItem('user');
        void this.router.navigate(['/connexion']);
      }
    }

    return throwError(() => error.error);
  };

  /!**
   * POST avec paramètres
   *!/
  postWithParams<T>(endPoint: string, data: any): Observable<any> {
    // Pour FormData, ne pas définir Content-Type (Angular le fera automatiquement avec le boundary)
    // Ajouter uniquement Accept: *!/!*
    const options: any = {};
    if (data instanceof FormData) {
      options.headers = { 'Accept': '*!/!*' };
      // Ne PAS définir Content-Type pour FormData, le navigateur le fait automatiquement
    }

    return this.httpClient
      .post(`${environment.apiUrl}/${endPoint}`, data, options)
      .pipe(catchError(this.handleError));
  }

  /!**
   * POST pour upload de fichiers
   *!/
  postWithParamsUpload<T>(endPoint: string, data: any): Observable<any> {
    return this.httpClient
      .post(`${environment.apiUrl}/${endPoint}`, data)
      .pipe(catchError(this.handleError));
  }

  /!**
   * PUT pour upload de fichiers
   *!/
  putWithParamsUpload<T>(endPoint: string, data: any): Observable<any> {
    return this.httpClient
      .put(`${environment.apiUrl}/${endPoint}`, data)
      .pipe(catchError(this.handleError));
  }

  /!**
   * GET simple
   *!/
  get<T>(endPoint: string): Observable<any> {
    return this.httpClient
      .get(`${environment.apiUrl}/${endPoint}`)
      .pipe(catchError(this.handleError));
  }

  /!**
   * GET avec paramètres
   *!/
  getWithParams<T>(endPoint: string): Observable<any> {
    return this.httpClient
      .get(`${environment.apiUrl}/${endPoint}`)
      .pipe(catchError(this.handleError));
  }

  /!**
   * GET avec pagination
   *!/
  getWithPaginateParams<T>(endPoint: string, page?: number, limit?: number): Observable<any> {
    const url = `${environment.apiUrl}/${endPoint}?page=${page}&limit=${limit}`;
    return this.httpClient.get(url).pipe(catchError(this.handleError));
  }

  /!**
   * GET avec recherche et pagination
   *!/
  getSearchWithPaginateParams<T>(
    endPoint: string,
    page?: number,
    limit?: number,
    searchdata?: string
  ): Observable<any> {
    const url = `${environment.apiUrl}/${endPoint}?searchterms=${searchdata}&page=${page}&limit=${limit}`;
    return this.httpClient.get(url).pipe(catchError(this.handleError));
  }

  /!**
   * GET avec paramètres personnalisés
   *!/
  getWithCustomParams<T>(endPoint: string, httpParams?: string): Observable<any> {
    const url = `${environment.apiUrl}/${endPoint}${httpParams}`;
    return this.httpClient.get(url).pipe(catchError(this.handleError));
  }

  /!**
   * PUT avec paramètres
   *!/
  putWithParams<T>(endPoint: string, data?: any): Observable<any> {
    return this.httpClient
      .put(`${environment.apiUrl}/${endPoint}`, data)
      .pipe(catchError(this.handleError));
  }

  /!**
   * DELETE
   *!/
  delete<T>(endPoint: string): Observable<any> {
    return this.httpClient
      .delete(`${environment.apiUrl}/${endPoint}`)
      .pipe(catchError(this.handleError));
  }

  /!**
   * PATCH
   *!/
  patch<T>(endPoint: string, data?: any): Observable<any> {
    return this.httpClient
      .patch(`${environment.apiUrl}/${endPoint}`, data)
      .pipe(catchError(this.handleError));
  }

  /!**
   * Formater la réponse GET
   *!/
  format_getResponse = (json?: any): httpJsonResponse => {
    if (json?.status && json?.count > 0) {
      return {
        count: json?.count,
        page: json?.page,
        message: json?.message,
        data: json?.data,
        error: json?.status,
      };
    } else {
      return {
        count: 0,
        page: 0,
        message: json?.message,
        data: [],
        error: json?.status,
      };
    }
  };
}

*/

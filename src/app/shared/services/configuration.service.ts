import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';



export interface Configuration {
  id: number;
  configurationid: string;
  key: string;
  value: string;
  description?: string;
  type: string;
  category: string;
  is_public: boolean;
  createdby: string;
  createdon: string;
  updatedby?: string;
  updatedon?: string;
  status: number;
}

export interface ConfigurationCreate {
  key: string;
  value?: string;
  description?: string;
  type?: string;
  category?: string;
  is_public?: boolean;
}

export interface ConfigurationUpdate {
  value?: string;
  description?: string;
  type?: string;
  category?: string;
  is_public?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private http = inject(HttpClient);
  private apiUrl = `/configuration`;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Récupérer toutes les configurations
   */
  getAll(page: number = 1, limit: number = 50, category?: string): Observable<any> {
    let params: any = { page: page.toString(), limit: limit.toString() };
    if (category) {
      params.category = category;
    }
    return this.http.get(this.apiUrl, {
      headers: this.getHeaders(),
      params
    });
  }

  /**
   * Récupérer une configuration par clé
   */
  getByKey(key: string): Observable<Configuration> {
    return this.http.get<Configuration>(`${this.apiUrl}/${key}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Créer une nouvelle configuration
   */
  create(data: ConfigurationCreate): Observable<Configuration> {
    return this.http.post<Configuration>(this.apiUrl, data, {
      headers: this.getHeaders()
    });
  }

  /**
   * Mettre à jour une configuration
   */
  update(id: string, data: ConfigurationUpdate): Observable<Configuration> {
    return this.http.put<Configuration>(`${this.apiUrl}/${id}`, data, {
      headers: this.getHeaders()
    });
  }

  /**
   * Supprimer une configuration
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}


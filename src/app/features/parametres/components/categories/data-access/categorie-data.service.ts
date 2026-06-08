import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../../../tools/api.service';

export interface Categorie {
  id: number;
  categorieid: string;
  code: string;
  name: string;
  description?: string;
  parentid?: string;
  slug?: string;
  meta_title?: string;
  meta_description?: string;
  image_url?: string;
  icon?: string;
  color?: string;
  sort_order?: number;
  is_visible?: boolean;
  is_featured?: boolean;
  createdby: string;
  createdon: string;
  updatedby?: string;
  updatedon?: string;
  deletedby?: string;
  deletedon?: string;
  status: number;
  
  // Relations
  parent_name?: string;
  products_count?: number;
}

export interface PaginatedCategories {
  data: Categorie[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateCategorieDto {
  code: string;
  name: string;
  description?: string;
  parentid?: string;
  color?: string;
  icon?: string;
  is_visible?: boolean;
  is_featured?: boolean;
}

export interface UpdateCategorieDto extends Partial<CreateCategorieDto> {}

@Injectable({
  providedIn: 'root',
})
export class CategorieDataService {
  private apiService = inject(ApiService);
  private readonly endpoint = 'categories';

  /**
   * Récupérer toutes les catégories avec pagination
   */
  getAllCategories(page: number = 1, limit: number = 10, search?: string, parentid?: string): Observable<PaginatedCategories> {
    let url = `${this.endpoint}?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    if (parentid) url += `&parentid=${parentid}`;
    
    return this.apiService.get(url).pipe(
      map((response: any) => {
        // L'API retourne { data: { status, statusCode, message, data: [...], meta: {...} }, meta: {...} }
        // On doit extraire response.data.data (le tableau) et response.data.meta (pagination)
        const apiData = response.data || {};
        
        const result = {
          data: apiData.data || [],  // Le tableau des catégories
          meta: apiData.meta || {
            page: page,
            limit: limit,
            total: 0,
            totalPages: 0,
          },
        };
        
        return result;
      })
    );
  }

  /**
   * Récupérer une catégorie par ID
   */
  getCategorieById(id: string): Observable<Categorie> {
    return this.apiService.getWithParams(`${this.endpoint}/${id}`).pipe(
      map((response: any) => response.data?.data || response.data)
    );
  }

  /**
   * Créer une nouvelle catégorie
   */
  createCategorie(data: CreateCategorieDto): Observable<Categorie> {
    return this.apiService.postWithParams(this.endpoint, data).pipe(
      map((response: any) => response.data?.data || response.data)
    );
  }

  /**
   * Mettre à jour une catégorie
   */
  updateCategorie(id: string, data: UpdateCategorieDto): Observable<Categorie> {
    return this.apiService.patch(`${this.endpoint}/${id}`, data).pipe(
      map((response: any) => response.data?.data || response.data)
    );
  }

  /**
   * Supprimer une catégorie (soft delete)
   */
  deleteCategorie(id: string): Observable<void> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Générer un code catégorie unique
   */
  generateCategorieCode(): Observable<{ code: string }> {
    return this.apiService.get(`${this.endpoint}/generate-code`).pipe(
      map((response: any) => {
        return response.data || response;
      })
    );
  }

  /**
   * Récupérer TOUTES les catégories sans pagination
   * Utilisé pour les select/dropdown dans les formulaires
   */
  getAllCategoriesNoPagination(status: number = 1): Observable<Categorie[]> {
    return this.apiService.get(`${this.endpoint}/all?status=${status}`).pipe(
      map((response: any) => {
        // L'API retourne { data: { success: true, data: [...] } }
        // Il faut extraire response.data.data (double data)
        const apiData = response.data || response;
        return apiData.data || apiData || [];
      })
    );
  }

  /**
   * Récupérer les catégories principales (sans parent)
   */
  getMainCategories(): Observable<PaginatedCategories> {
    return this.apiService.get(`${this.endpoint}?parentid=null`).pipe(
      map((response: any) => {
        const apiData = response.data || {};
        return {
          data: apiData.data || [],
          meta: apiData.meta || {
            page: 1,
            limit: 100,
            total: 0,
            totalPages: 0,
          },
        };
      })
    );
  }

  /**
   * Récupérer les sous-catégories d'une catégorie
   */
  getSubCategories(parentid: string): Observable<PaginatedCategories> {
    return this.apiService.get(`${this.endpoint}?parentid=${parentid}`).pipe(
      map((response: any) => {
        const apiData = response.data || {};
        return {
          data: apiData.data || [],
          meta: apiData.meta || {
            page: 1,
            limit: 100,
            total: 0,
            totalPages: 0,
          },
        };
      })
    );
  }
}


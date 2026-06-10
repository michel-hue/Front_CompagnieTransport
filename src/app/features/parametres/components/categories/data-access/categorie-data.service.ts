import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as http from 'node:http';
//import { ApiService } from '../../../../../tools/api.service';

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
  //private apiService = inject(ApiService);
  private readonly endpoint = 'categories';

  /**
   * Récupérer toutes les catégories avec pagination
   */
  getAllCategories(): Observable<PaginatedCategories> {


    return this.getAllCategories()
  }

  /**
   * Récupérer une catégorie par ID
   */
  getCategorieById(id: string): Observable<Categorie> {
    return this.getCategorieById(id)
  }

  /**
   * Créer une nouvelle catégorie
   */
  createCategorie(): Observable<Categorie> {
    return this.createCategorie()
  }

  /**
   * Mettre à jour une catégorie
   */
  updateCategorie(): Observable<Categorie> {
    return this.updateCategorie();
  }

  /**
   * Supprimer une catégorie (soft delete)
   */
  deleteCategorie(): Observable<void> {
    return this.deleteCategorie()
  }

  /**
   * Générer un code catégorie unique
   */
  generateCategorieCode(): Observable<{ code: string }> {
    return this.generateCategorieCode()
  }

  /**
   * Récupérer TOUTES les catégories sans pagination
   * Utilisé pour les select/dropdown dans les formulaires
   */
  getAllCategoriesNoPagination(): Observable<Categorie[]> {
    return this.getAllCategoriesNoPagination()
  }

  /**
   * Récupérer les catégories principales (sans parent)
   */
  getMainCategories(): Observable<PaginatedCategories> {
    return this.getMainCategories()
  }

  /**
   * Récupérer les sous-catégories d'une catégorie
   */
  getSubCategories(): Observable<PaginatedCategories> {
    return this.getSubCategories()
  }
}


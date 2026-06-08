import { Component, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Table } from '../../../../shared/components/ui/table/table';
import { Params } from '../../../../shared/interface/core.interface';
import { ITableClickedAction, ITableConfig } from '../../../../shared/interface/table.interface';
import { CategorieDataService, Categorie } from './data-access';
import { ConfirmModalComponent } from '../../../../tools/confirm-modal/confirm-modal';
import { ModalFormCategorieComponent } from './modals/form-categorie/modal-form-categorie';
import { SimpleDescriptionModalComponent } from './modals/simple-description/simple-description-modal';
import { ErrorHandlerService } from '../../../../tools/error-handler.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, Table, TranslateModule, ConfirmModalComponent, ModalFormCategorieComponent, SimpleDescriptionModalComponent],
})
export class CategoriesComponent {
  private categorieDataService = inject(CategorieDataService);
  private errorHandler = inject(ErrorHandlerService);
  private translate = inject(TranslateService);
  
  readonly confirmModal = viewChild<ConfirmModalComponent>('confirmModal');
  readonly formModal = viewChild<ModalFormCategorieComponent>('formModal');
  readonly descriptionModal = viewChild<SimpleDescriptionModalComponent>('descriptionModal');

  // Variables pour le datatable
  public categories: any[] = [];
  public loading: boolean = false;
  public totalItems: number = 0;
  public filterType: 'all' | 'parent' | 'child' = 'all';
  private isFirstLoad: boolean = true; // Flag pour éviter le double chargement

  public tableConfig: ITableConfig = {
    columns: [],
    rowActions: [],
    data: [] as Categorie[],
    total: 0,
  };

  ngOnInit() {
    // Initialiser la config du tableau avec les traductions
    this.initTableConfig();
    
    // S'abonner aux changements de langue
    this.translate.onLangChange.subscribe(() => {
      this.initTableConfig();
    });
    
    // Le chargement sera déclenché automatiquement par le Table
  }

  /**
   * Initialiser la configuration du tableau avec les traductions actuelles
   */
  private initTableConfig(): void {
    const currentData = this.tableConfig.data || [];
    const currentTotal = this.tableConfig.total || 0;
    
    this.tableConfig = {
      columns: [
        { title: this.translate.instant('category_code'), dataField: 'code', sortable: true, sort_direction: 'desc' },
        { title: this.translate.instant('category_name'), dataField: 'name', sortable: true },
        { title: this.translate.instant('parent_category'), dataField: 'parent_name', sortable: false },
        { 
          title: this.translate.instant('visible'), 
          dataField: 'is_visible', 
          type: 'switch',
          sortable: false
        },
        { 
          title: this.translate.instant('featured'), 
          dataField: 'is_featured', 
          type: 'switch',
          sortable: false
        },
      ],
      rowActions: [
        { label: this.translate.instant('edit'), actionToPerform: 'edit', icon: 'ri-pencil-line' },
        { label: this.translate.instant('delete'), actionToPerform: 'custom-delete', icon: 'ri-delete-bin-line' },
        { label: this.translate.instant('view_description'), actionToPerform: 'view-description', icon: 'ri-information-line' },
      ],
      data: currentData,
      total: currentTotal,
    };
  }

  /**
   * Gérer le changement de filtre
   */
  onFilterChange(): void {
    this.loadCategories();
  }

  /**
   * Charger la liste des catégories
   */
  loadCategories(params?: Params): void {
    const page = params?.['page'] || 1;
    const limit = params?.['perPage'] || 10;
    
    // Utiliser setTimeout pour éviter ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.loading = true;
    });
    
    // Ajouter le filtre parentid selon le type sélectionné
    let parentidFilter: string | undefined = undefined;
    if (this.filterType === 'parent') {
      parentidFilter = 'null'; // Catégories principales (sans parent)
    } else if (this.filterType === 'child') {
      parentidFilter = 'notnull'; // Sous-catégories (avec parent)
    }
    
    this.categorieDataService.getAllCategories(page, limit, undefined, parentidFilter).subscribe({
      next: (response) => {
        // Transformer les données pour afficher "Pas de parent" et convertir booléens en '1'/'0' pour switches
        const transformedData = response.data.map(cat => ({
          ...cat,
          parent_name: cat.parent_name || 'Pas de parent',
          is_visible: cat.is_visible ? '1' : '0',
          is_featured: cat.is_featured ? '1' : '0',
        }));
        
        // Stocker les catégories pour accès ultérieur
        this.categories = transformedData;
        
        // Mettre à jour les données du tableau
        this.tableConfig = {
          ...this.tableConfig,
          data: transformedData,
          total: response.meta.total,
        };
        
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorHandler.handleError(error, 'Impossible de charger les catégories');
      },
    });
  }

  /**
   * Gérer les changements du tableau (pagination, tri, etc.)
   */
  onTableChange(params?: Params): void {
    // Ignorer le premier appel du Table si on a déjà chargé
    if (this.isFirstLoad && (!params || Object.keys(params).length === 0)) {
      this.isFirstLoad = false;
      return;
    }
    this.isFirstLoad = false;
    this.loadCategories(params);
  }

  /**
   * Gérer les actions du tableau
   */
  onActionClicked(action: ITableClickedAction): void {
    if (action.actionToPerform === 'view-description') {
      this.showDescription(action.data);
    } else if (action.actionToPerform === 'edit') {
      this.edit(action.data);
    } else if (action.actionToPerform === 'custom-delete') {
      void this.delete(action.data);
    }
  }


  /**
   * Actualiser les données
   */
  refreshData(): void {
    this.loadCategories();
  }

  /**
   * Ouvrir le modal de création
   */
  async openCreateModal(): Promise<void> {
    const saved = await this.formModal()?.openCreateModal();
    if (saved) {
      this.loadCategories();
    }
  }

  /**
   * Ouvrir le modal d'édition
   */
  async edit(data: Categorie): Promise<void> {
    const saved = await this.formModal()?.openEditModal(data);
    if (saved) {
      this.loadCategories();
    }
  }

  /**
   * Supprimer une catégorie
   */
  async delete(data: Categorie): Promise<void> {
    const confirmed = await this.confirmModal()?.openModal({
      title: 'Supprimer la catégorie',
      message: `Êtes-vous sûr de vouloir supprimer la catégorie "${data.name}" ?`,
      icon: 'ri-delete-bin-line',
      iconClass: 'icon-box',
      confirmText: 'Oui, supprimer',
      cancelText: 'Annuler',
      confirmButtonClass: 'btn-danger btn-md fw-bold btn',
      cancelButtonClass: 'btn-md fw-bold btn btn-secondary',
      data: data,
    });

    if (confirmed) {
      // Utiliser l'id (UUID) au lieu de categorieid
      const categoryId = String(data.id || data.categorieid);
      this.categorieDataService.deleteCategorie(categoryId).subscribe({
        next: () => {
          this.errorHandler.handleSuccess(
            `La catégorie "${data.name}" a été supprimée avec succès`,
            'Catégorie supprimée'
          );
          this.loadCategories();
        },
        error: (error) => {
          this.errorHandler.handleError(error, `Impossible de supprimer la catégorie "${data.name}"`);
        },
      });
    }
  }

  /**
   * Afficher le modal de description
   */
  showDescription(cat: any): void {
    if (cat.description) {
      this.descriptionModal()?.open(cat.name, cat.description);
    } else {
      this.errorHandler.handleError(null, 'Aucune description disponible pour cette catégorie');
    }
  }
}


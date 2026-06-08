import { Component, inject, viewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CategorieDataService, Categorie, CreateCategorieDto, UpdateCategorieDto } from '../../data-access';
import { ErrorHandlerService } from '../../../../../../tools/error-handler.service';

@Component({
  selector: 'app-modal-form-categorie',
  templateUrl: './modal-form-categorie.html',
  styleUrls: ['./modal-form-categorie.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
})
export class ModalFormCategorieComponent {
  private modalService = inject(NgbModal);
  private categorieDataService = inject(CategorieDataService);
  private errorHandler = inject(ErrorHandlerService);

  readonly formModal = viewChild<TemplateRef<any>>('formModal');

  public form: FormGroup;
  public modalRef: NgbModalRef | null = null;
  public isEditMode: boolean = false;
  public currentCategorieId: string | null = null;
  public loading: boolean = false;
  public mainCategories: Categorie[] = [];
  
  /**
   * Obtenir les catégories principales disponibles (excluant la catégorie en cours de modification)
   */
  get availableMainCategories(): Categorie[] {
    if (!this.isEditMode || !this.currentCategorieId) {
      return this.mainCategories;
    }
    // Exclure la catégorie en cours de modification
    return this.mainCategories.filter(cat => {
      const catId = cat.id || cat.categorieid;
      return catId !== this.currentCategorieId;
    });
  }

  constructor() {
    this.initForm();
    this.loadMainCategories(); // Charger les catégories principales au démarrage
  }

  private initForm(): void {
    this.form = new FormGroup({
      code: new FormControl('', [Validators.required, Validators.minLength(3)]),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl(''),
      parentid: new FormControl(null),
      color: new FormControl('#3B82F6'), // Couleur par défaut (bleu)
      is_visible: new FormControl(true),
      is_featured: new FormControl(false),
    });
  }

  /**
   * Charger les catégories principales pour le select
   */
  private loadMainCategories(): void {
    this.categorieDataService.getMainCategories().subscribe({
      next: (response) => {
        this.mainCategories = response.data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories principales', error);
        this.mainCategories = [];
      },
    });
  }

  /**
   * Ouvrir le modal en mode création
   */
  openCreateModal(): Promise<boolean> {
    this.isEditMode = false;
    this.currentCategorieId = null;
    this.form.reset({
      color: this.generateRandomColor(), // Générer une couleur aléatoire
      is_visible: true,
      is_featured: false,
    });
    
    // Générer le code automatiquement
    this.generateCode();
    
    return this.openModal();
  }

  /**
   * Générer un code catégorie automatique
   */
  private generateCode(): void {
    this.categorieDataService.generateCategorieCode().subscribe({
      next: (response) => {
        this.form.patchValue({
          code: response.code,
        });
      },
      error: (error) => {
        console.error('Erreur lors de la génération du code', error);
      },
    });
  }

  /**
   * Générer une couleur aléatoire
   */
  private generateRandomColor(): string {
    const colors = [
      '#3B82F6', // Bleu
      '#10B981', // Vert
      '#F59E0B', // Orange
      '#EF4444', // Rouge
      '#8B5CF6', // Violet
      '#EC4899', // Rose
      '#14B8A6', // Teal
      '#F97316', // Orange foncé
      '#6366F1', // Indigo
      '#06B6D4', // Cyan
      '#84CC16', // Lime
      '#F43F5E', // Rose-rouge
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Ouvrir le modal en mode édition
   */
  openEditModal(categorie: any): Promise<boolean> {
    this.isEditMode = true;
    // Utiliser l'id (UUID) au lieu de categorieid
    this.currentCategorieId = categorie.id || categorie.categorieid;
    
    // Convertir les valeurs string '1'/'0' en booléens pour le formulaire
    const isVisibleValue = categorie.is_visible === '1' || categorie.is_visible === true;
    const isFeaturedValue = categorie.is_featured === '1' || categorie.is_featured === true;
    
    this.form.patchValue({
      code: categorie.code,
      name: categorie.name,
      description: categorie.description,
      parentid: categorie.parentid || null,
      color: categorie.color || '#3B82F6',
      is_visible: isVisibleValue,
      is_featured: isFeaturedValue,
    });
    
    console.log('Formulaire rempli avec:', this.form.value);
    
    return this.openModal();
  }

  /**
   * Ouvrir le modal
   */
  private openModal(): Promise<boolean> {
    return new Promise((resolve) => {
      this.modalRef = this.modalService.open(this.formModal(), {
        ariaLabelledBy: 'Categorie-Form-Modal',
        centered: true,
        size: 'lg',
        backdrop: 'static',
      });

      this.modalRef.result.then(
        (result) => {
          resolve(result === 'saved');
        },
        () => {
          resolve(false);
        }
      );
    });
  }

  /**
   * Soumettre le formulaire
   */
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const formValue = this.form.value;
    
    // Nettoyer les valeurs vides, mais conserver parentid même s'il est null
    const data = Object.keys(formValue).reduce((acc, key) => {
      // Toujours inclure parentid même s'il est null (pour permettre de retirer le parent)
      if (key === 'parentid') {
        acc[key] = formValue[key];
      } else if (formValue[key] !== '' && formValue[key] !== null) {
        acc[key] = formValue[key];
      }
      return acc;
    }, {} as any);

    if (this.isEditMode && this.currentCategorieId) {
      this.updateCategorie(data);
    } else {
      this.createCategorie(data);
    }
  }

  /**
   * Créer une nouvelle catégorie
   */
  private createCategorie(data: CreateCategorieDto): void {
    // L'API récupère automatiquement user_id depuis le JWT pour createdBy/updatedBy
    this.categorieDataService.createCategorie(data).subscribe({
      next: () => {
        this.loading = false;
        this.errorHandler.handleSuccess(
          'La catégorie a été créée avec succès',
          'Catégorie créée'
        );
        this.modalRef?.close('saved');
      },
      error: (error) => {
        this.loading = false;
        this.errorHandler.handleError(error, 'Impossible de créer la catégorie');
      },
    });
  }

  /**
   * Mettre à jour une catégorie
   */
  private updateCategorie(data: UpdateCategorieDto): void {
    if (!this.currentCategorieId) {
      console.error('❌ ID de catégorie manquant pour la mise à jour');
      return;
    }

    // Retirer le code des données de mise à jour (il ne doit jamais être modifié)
    const { code, ...updateData } = data;

    // S'assurer que l'ID est une string
    const categoryId = String(this.currentCategorieId);

    // L'API récupère automatiquement user_id depuis le JWT pour updatedBy
    console.log('🔄 Mise à jour catégorie:', categoryId, updateData);

    this.categorieDataService.updateCategorie(categoryId, updateData).subscribe({
      next: (response) => {
        console.log('✅ Catégorie mise à jour:', response);
        this.loading = false;
        this.errorHandler.handleSuccess(
          'La catégorie a été mise à jour avec succès',
          'Catégorie mise à jour'
        );
        this.modalRef?.close('saved');
      },
      error: (error) => {
        console.error('❌ Erreur mise à jour:', error);
        this.loading = false;
        this.errorHandler.handleError(error, 'Impossible de mettre à jour la catégorie');
      },
    });
  }

  /**
   * Fermer le modal
   */
  close(): void {
    this.modalRef?.dismiss('cancel');
  }

}


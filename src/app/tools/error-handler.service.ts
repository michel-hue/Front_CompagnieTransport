import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private toastr = inject(ToastrService);

  /**
   * Afficher un message d'erreur formaté
   */
  handleError(error: any, defaultMessage: string = 'Une erreur est survenue'): void {
    console.error('❌ Erreur complète:', error);
    console.error('📊 Structure de l\'erreur:', {
      message: error?.message,
      errorMessage: error?.error?.message,
      statusCode: error?.statusCode,
      status: error?.status,
    });

    let errorMessage = defaultMessage;
    let errorTitle = 'Erreur';

    // Extraire le message d'erreur de différentes structures possibles
    if (error?.message) {
      errorMessage = error.message;
    } else if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    // Si le message est un tableau, prendre le premier élément
    if (Array.isArray(errorMessage)) {
      errorMessage = errorMessage[0];
    }

    console.error('📢 Message final affiché:', errorMessage);

    // Gérer les erreurs spécifiques par code HTTP
    if (error?.statusCode || error?.status) {
      const statusCode = error.statusCode || error.status;
      
      switch (statusCode) {
        case 400:
          errorTitle = 'Données invalides';
          errorMessage = this.extractValidationErrors(error) || errorMessage;
          break;
        case 401:
          errorTitle = 'Non autorisé';
          errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
          break;
        case 403:
          errorTitle = 'Accès refusé';
          errorMessage = 'Vous n\'avez pas les permissions nécessaires.';
          break;
        case 404:
          errorTitle = 'Non trouvé';
          errorMessage = 'La ressource demandée n\'existe pas.';
          break;
        case 409:
          errorTitle = 'Conflit';
          // Le message de l'API est généralement explicite pour les conflits, on le garde
          // errorMessage est déjà défini ci-dessus
          break;
        case 422:
          errorTitle = 'Validation échouée';
          errorMessage = this.extractValidationErrors(error) || errorMessage;
          break;
        case 500:
          errorTitle = 'Erreur serveur';
          errorMessage = 'Une erreur interne est survenue. Veuillez réessayer.';
          break;
        case 503:
          errorTitle = 'Service indisponible';
          errorMessage = 'Le service est temporairement indisponible.';
          break;
      }
    }

    // Afficher le toast d'erreur
    this.toastr.error(errorMessage, errorTitle, {
      timeOut: 5000,
      progressBar: true,
      closeButton: true,
    });
  }

  /**
   * Afficher un message de succès
   */
  handleSuccess(message: string, title: string = 'Succès'): void {
    this.toastr.success(message, title, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    });
  }

  /**
   * Afficher un message d'information
   */
  handleInfo(message: string, title: string = 'Information'): void {
    this.toastr.info(message, title, {
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    });
  }

  /**
   * Afficher un avertissement
   */
  handleWarning(message: string, title: string = 'Attention'): void {
    this.toastr.warning(message, title, {
      timeOut: 4000,
      progressBar: true,
      closeButton: true,
    });
  }

  /**
   * Extraire les erreurs de validation
   */
  private extractValidationErrors(error: any): string | null {
    if (error?.error?.errors && Array.isArray(error.error.errors)) {
      return error.error.errors.map((e: any) => e.message || e).join(', ');
    }
    
    if (error?.error?.message && Array.isArray(error.error.message)) {
      return error.error.message.join(', ');
    }

    return null;
  }
}


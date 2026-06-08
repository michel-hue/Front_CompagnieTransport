import { Component, inject, viewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseAuthService } from '../../../../shared/services/firebase-auth.service';
import { ErrorHandlerService } from '../../../../tools/error-handler.service';

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.html',
  styleUrls: ['./forgot-password-modal.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
})
export class ForgotPasswordModalComponent {
  private modalService = inject(NgbModal);
  private firebaseAuth = inject(FirebaseAuthService);
  private errorHandler = inject(ErrorHandlerService);

  readonly forgotPasswordModal = viewChild<TemplateRef<any>>('forgotPasswordModal');

  public form: FormGroup;
  public modalRef: NgbModalRef | null = null;
  public loading: boolean = false;
  public emailSent: boolean = false;

  constructor() {
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  /**
   * Ouvrir le modal
   */
  openModal(): Promise<boolean> {
    return new Promise((resolve) => {
      this.emailSent = false;
      this.form.reset();
      this.modalRef = this.modalService.open(this.forgotPasswordModal(), {
        ariaLabelledBy: 'Forgot-Password-Modal',
        centered: true,
        size: 'md',
        backdrop: 'static',
      });

      this.modalRef.result.then(
        (result) => {
          resolve(result === 'sent');
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
  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    try {
      const email = this.form.get('email')?.value;
      await this.firebaseAuth.sendPasswordResetEmail(email);
      
      this.emailSent = true;
      this.loading = false;
      
      this.errorHandler.handleSuccess(
        'Un email de réinitialisation a été envoyé à votre adresse email',
        'Email envoyé'
      );
    } catch (error: any) {
      this.loading = false;
      console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
      
      let errorMessage = 'Impossible d\'envoyer l\'email de réinitialisation';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Aucun compte n\'est associé à cette adresse email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Adresse email invalide';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard';
      }
      
      this.errorHandler.handleError(error, errorMessage);
    }
  }

  /**
   * Fermer le modal
   */
  close(): void {
    this.modalRef?.close('sent');
  }

  /**
   * Retour au formulaire
   */
  backToForm(): void {
    this.emailSent = false;
    this.form.reset();
  }
}


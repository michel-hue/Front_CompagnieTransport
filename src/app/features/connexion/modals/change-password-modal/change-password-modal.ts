import { Component, inject, viewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthDataService } from '../../data-access';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.html',
  styleUrls: ['./change-password-modal.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
})
export class ChangePasswordModalComponent {
  private modalService = inject(NgbModal);
  private authDataService = inject(AuthDataService);

  readonly modal = viewChild<TemplateRef<any>>('changePasswordModal');

  public form: FormGroup;
  public modalRef: NgbModalRef | null = null;
  public loading: boolean = false;
  public errorMessage: string = '';
  public showNewPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  public username: string = '';

  constructor() {
    this.form = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Ouvrir le modal
   */
  open(username: string): Promise<any> {
    return new Promise((resolve) => {
      this.username = username;
      this.form.reset();
      this.errorMessage = '';

      const modalElement = this.modal();
      if (modalElement) {
        this.modalRef = this.modalService.open(modalElement, {
          size: 'md',
          centered: true,
          backdrop: 'static',
          keyboard: false,
        });

        this.modalRef.result.then(
          (result) => resolve(result),
          () => resolve(null)
        );
      }
    });
  }

  /**
   * Soumettre le nouveau mot de passe
   */
  async submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const { newPassword, confirmPassword } = this.form.value;

    // Vérifier que les mots de passe correspondent
    if (newPassword !== confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
    /*  const response = await this.authDataService.changeFirstPassword(
        this.username,
        newPassword,
        confirmPassword
      );*/

   /*   if (response?.data) {
        this.modalRef?.close(response.data);
      } else {
        this.errorMessage = 'Erreur lors du changement de mot de passe';
      }*/
    } catch (error: any) {
      console.error('Erreur changement mot de passe:', error);
      this.errorMessage = error?.message || 'Erreur lors du changement de mot de passe';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Basculer la visibilité du mot de passe
   */
  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}


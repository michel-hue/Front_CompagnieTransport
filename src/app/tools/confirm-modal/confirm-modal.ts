/*
import { Component, TemplateRef, inject, output, viewChild, input } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Button } from '../../shared/components/ui/button/button';
import { NgClass } from '@angular/common';

export interface ConfirmModalConfig {
  title?: string;
  message?: string;
  icon?: string;
  iconClass?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  data?: any;
}

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.html',
  styleUrls: ['./confirm-modal.scss'],
  standalone: true,
  imports: [
    Button,
    TranslateModule,

  ],
})
export class ConfirmModalComponent {
  private modalService = inject(NgbModal);

  // Configuration par défaut
  public config: ConfirmModalConfig = {
    title: 'Confirmation',
    message: 'Êtes-vous sûr de vouloir effectuer cette action ?',
    icon: 'ri-question-line',
    iconClass: 'icon-box wo-bg',
    confirmText: 'Oui',
    cancelText: 'Non',
    confirmButtonClass: 'btn-theme btn-md fw-bold btn',
    cancelButtonClass: 'btn-md fw-bold btn btn-secondary',
  };

  public closeResult: string = '';
  public modalOpen: boolean = false;
  private modalRef: NgbModalRef | null = null;

  readonly ConfirmModal = viewChild<TemplateRef<any>>('confirmModal');
  readonly confirmed = output<any>();
  readonly cancelled = output<void>();

  /!**
   * Ouvrir le modal avec une configuration personnalisée
   *!/
  async openModal(config?: Partial<ConfirmModalConfig>): Promise<boolean> {
    this.modalOpen = true;

    // Fusionner la configuration par défaut avec la configuration fournie
    this.config = {
      ...this.config,
      ...config,
    };

    return new Promise((resolve) => {
      this.modalRef = this.modalService.open(this.ConfirmModal(), {
        ariaLabelledBy: 'Confirm-Modal',
        centered: true,
        windowClass: 'theme-modal text-center',
      });

      this.modalRef.result.then(
        (result) => {
          this.modalOpen = false;
          resolve(result === 'confirmed');
        },
        (reason) => {
          this.modalOpen = false;
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.cancelled.emit();
          resolve(false);
        },
      );
    });
  }

  /!**
   * Confirmer l'action
   *!/
  confirm(): void {
    this.confirmed.emit(this.config.data);
    this.modalRef?.close('confirmed');
  }

  /!**
   * Annuler l'action
   *!/
  cancel(): void {
    this.cancelled.emit();
    this.modalRef?.dismiss('Cancel');
  }

  private getDismissReason(reason: ModalDismissReasons): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnDestroy(): void {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }
}

*/

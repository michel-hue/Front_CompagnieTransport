import { Component, viewChild, inject } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-description-modal',
  templateUrl: './simple-description-modal.html',
  styleUrls: ['./simple-description-modal.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class SimpleDescriptionModalComponent {
  private modalService = inject(NgbModal);
  private modalRef?: NgbModalRef;
  
  readonly modal = viewChild<any>('descriptionModal');

  public title: string = '';
  public description: string = '';

  /**
   * Ouvrir le modal avec une description
   */
  open(title: string, description: string): void {
    this.title = title;
    this.description = description;
    
    const modalElement = this.modal();
    if (modalElement) {
      this.modalRef = this.modalService.open(modalElement, {
        size: 'md',
        centered: true,
        backdrop: true,
      });
    }
  }

  /**
   * Fermer le modal
   */
  close(): void {
    this.modalRef?.close();
  }
}


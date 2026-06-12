import { Component, OnDestroy, TemplateRef, inject, output, viewChild } from '@angular/core';

import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ITableClickedAction } from '../../../../interface/table.interface';

import { Button } from '../../button/button';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.html',
  styleUrls: ['./delete-modal.scss'],
  imports: [Button, TranslateModule],
})
export class DeleteModal implements OnDestroy {
  private readonly modalService = inject(NgbModal);

  public closeResult: string = '';
  public modalOpen: boolean = false;
  public userAction: ITableClickedAction | null = null;

  readonly deleteModal = viewChild.required<TemplateRef<unknown>>('deleteModal');

  readonly deleteItem = output<ITableClickedAction>();

  openModal(action: string, data: unknown): void {
    this.modalOpen = true;
    this.userAction = {
      actionToPerform: action,
      data: data,
    };

    this.modalService
      .open(this.deleteModal(), {
        ariaLabelledBy: 'Delete-Modal',
        centered: true,
        windowClass: 'theme-modal text-center',
      })
      .result.then(
      (result: string) => {
        this.closeResult = `Result ${result}`;
      },
      (reason: ModalDismissReasons) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
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

  delete(_modal: NgbModalRef): void {
    if (this.userAction) {
      this.deleteItem.emit(this.userAction);
    }
  }

  ngOnDestroy(): void {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }
}

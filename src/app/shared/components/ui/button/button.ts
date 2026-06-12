import { CommonModule } from '@angular/common';
import { Component, inject, input, OnDestroy } from '@angular/core';

import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import { LoaderState } from '../../../state/loader.state';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
  imports: [CommonModule],
})
export class Button implements OnDestroy {
  readonly class = input<string>('btn btn-theme ms-auto mt-4');
  readonly classData = input<string>('btn btn-theme ms-auto mt-4');
  readonly iconClass = input<string | null>(null);
  readonly id = input.required<string>();
  readonly label = input<string>('Submit');
  readonly type = input<string>('submit');
  readonly spinner = input<boolean>(true);
  readonly disabled = input<boolean>(false);

  public buttonId: string | null = null;

  private readonly store = inject(Store);
  private readonly destroy$ = new Subject<void>();

  spinnerStatus$: Observable<boolean> = this.store.select(
    LoaderState.buttonSpinner,
  );

  constructor() {
    this.spinnerStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (!res) {
          this.buttonId = null;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onClick(id: string): void {
    this.buttonId = id;
  }
}

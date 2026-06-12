import { CommonModule, DatePipe, NgClass } from '@angular/common';
import {
  Component,
  DOCUMENT,
  inject,
  Input,
  input,
  OnDestroy,
  OnInit,
  output,
  Renderer2,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDropdownModule,
  NgbInputDatepicker,
  NgbRating,
  NgbRatingConfig,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { IPermission } from '../../../../shared/interface/role.interface';
import { AccountState } from '../../../../shared/state/account.state';
import { HasPermissionDirective } from '../../../directive/has-permission.directive';
import { Params } from '../../../interface/core.interface';
import {
  IBaseRow,
  ITableAction,
  ITableClickedAction,
  ITableColumn,
  ITableConfig, ITableRow,
} from '../../../interface/table.interface';
import { CustomCurrencyPipe } from '../../../pipes/custom-currency.pipe';
import { LoaderState } from '../../../state/loader.state';
import { ConfirmationModal } from '../modal/confirmation-modal/confirmation-modal';
import { DeleteModal } from '../modal/delete-modal/delete-modal';
import { Pagination } from '../pagination/pagination';

@Component({
  selector: 'app-table',
  templateUrl: './table.html',
  styleUrls: ['./table.scss'],
  imports: [
    ReactiveFormsModule,
    NgbInputDatepicker,
    NgbDropdownModule,
    NgClass,
    NgbRating,
    NgbTooltipModule,
    HasPermissionDirective,
    Pagination,
    DeleteModal,
    ConfirmationModal,
    CommonModule,
    DatePipe,
    TranslateModule,
    CustomCurrencyPipe,
  ],
})
export class Table implements OnInit, OnDestroy {
  private readonly document = inject<Document>(DOCUMENT);
  private readonly renderer = inject(Renderer2);
  private readonly calendar = inject(NgbCalendar);
  readonly formatter = inject(NgbDateParserFormatter);
  private readonly store = inject(Store);
  private readonly destroy$ = new Subject<void>();

  loadingStatus$: Observable<boolean> = this.store.select(LoaderState.status);
  permissions$: Observable<IPermission[]> = this.store.select(AccountState.permissions);

  @Input() tableConfig?: ITableConfig<any>;
  @Input() hasCheckbox: boolean = false;

  readonly hasDuplicate = input<boolean>(false);
  readonly topbar = input<boolean>(true);
  readonly pagination = input<boolean>(true);
  readonly loading = input<boolean>(true);
  readonly dateRange = input<boolean>(false);

  readonly tableChanged = output<Params>();
  readonly action = output<ITableClickedAction>();
  readonly rowClicked = output<unknown>();
  readonly selectedItems = output<number[]>();

  readonly deleteModal = viewChild.required<DeleteModal>('deleteModal');
  readonly confirmationModal = viewChild.required<ConfirmationModal>('confirmationModal');

  public term = new FormControl('');
  public rows = [10, 20, 30, 50, 100];
  public tableData: Params = {
    search: '',
    field: '',
    sort: '',
    page: 1,
    paginate: 10,
  };

  public selected: number[] = [];
  public permissions: string[] = [];

  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null = null;
  public toDate: NgbDate | null = null;

  constructor() {
    const config = inject(NgbRatingConfig);
    config.max = 5;
    config.readonly = true;

    this.term.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((data: string | null) => {
        this.onChangeTable(data ?? '', 'search');
      });
  }

  ngOnInit(): void {
    this.tableChanged.emit(this.tableData);

    this.permissions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((permission: IPermission[]) => {
        this.permissions = permission?.map((value: IPermission) => value?.name) ?? [];

        const permissions = this.tableConfig?.rowActions
          ?.map(action => action?.permission)
          .filter((item): item is string => item !== undefined);

        if (
          permissions?.length &&
          !permissions.some(action => this.permissions?.includes(action))
        ) {
          if (this.tableConfig) {
            this.tableConfig.rowActions = [];
          }
        }

        if (!this.hasPermission(['delete']) && !this.hasDuplicate()) {
          this.hasCheckbox = false;
        }
      });

    this.loadingStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (!res) {
          this.selected = [];
        }
      });
  }

  hasPermission(actions?: string[]): boolean {
    const permission = this.tableConfig?.rowActions?.find(action =>
      actions?.includes(action.actionToPerform),
    )?.permission;

    if (!permission) return false;

    if (!Array.isArray(permission)) {
      return this.permissions?.includes(permission) ?? false;
    }

    return permission.some(p => this.permissions?.includes(p));
  }

  onChangeTable(data: unknown, type: string): void {
    if (type === 'sort') {
      const columnData = data as ITableColumn;
      if (columnData && columnData.sortable !== false) {
        switch (columnData.sort_direction) {
          case 'asc':
            columnData.sort_direction = 'desc';
            break;
          case 'desc':
            columnData.sort_direction = 'asc';
            break;
          default:
            columnData.sort_direction = 'desc';
            break;
        }
        this.tableData.field = columnData.dataField ?? '';
        this.tableData.sort = this.tableData.sort === 'desc' ? 'asc' : 'desc';
      }
    } else if (type === 'paginate') {
      const event = data as Event;
      this.tableData.paginate = Number((event.target as HTMLInputElement)?.value) || 10;
    } else if (type === 'page') {
      this.tableData.page = Number(data) || 1;
    } else if (type === 'search') {
      this.tableData.search = String(data ?? '');
    } else if (type === 'daterange') {
      if (data) {
        const dateParams = data as { start_date: string; end_date: string };
        this.tableData.start_date = dateParams.start_date;
        this.tableData.end_date = dateParams.end_date;
      } else {
        delete this.tableData.start_date;
        delete this.tableData.end_date;
      }
    }

    this.renderer.addClass(this.document.body, 'loader-none');
    this.tableChanged.emit(this.tableData);
  }

  onActionClicked(actionType: string, rowData: unknown, value?: number): void {
    this.renderer.addClass(this.document.body, 'loader-none');
    const data = rowData as Record<string, unknown>;
    data[actionType] = value;
    this.action.emit({ actionToPerform: actionType, data: rowData });
  }

  onRowClicked(rowData: unknown): void {
    if (this.hasPermission(['edit', 'view'])) {
      this.rowClicked.emit(rowData);
    }
  }

  checkUncheckAll(event: Event): void {
    const target = event.target as HTMLInputElement;
    const isChecked = target?.checked ?? false;

    this.tableConfig?.data?.forEach((item: unknown) => {
      const row = item as Record<string, unknown>;
      if (row['system_reserve'] !== '1') {
        row['isChecked'] = isChecked;
        this.setSelectedItem(isChecked, Number(row['id']));
      }
    });
  }

  onItemChecked(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.setSelectedItem(
      target?.checked ?? false,
      Number(target?.value),
    );
  }

  setSelectedItem(checked: boolean, value: number): void {
    const numValue = Number(value);
    const index = this.selected.indexOf(numValue);

    if (checked) {
      if (index === -1) {
        this.selected.push(numValue);
      }
    } else {
      this.selected = this.selected.filter(id => id !== numValue);
    }

    this.selectedItems.emit(this.selected);
  }

  get deleteButtonStatus(): boolean {
    let status = false;

    this.tableConfig?.data?.forEach((data: unknown) => {
      const row = data as Record<string, unknown>;
      if (this.selected.includes(Number(row['id']))) {
        const permission = this.tableConfig?.rowActions?.find(
          action => action.actionToPerform === 'delete',
        )?.permission;

        if (typeof permission === 'string' && this.permissions?.includes(permission)) {
          status = true;
        }
      }
    });

    return status;
  }

  get duplicateButtonStatus(): boolean {
    let status = false;

    this.tableConfig?.data?.forEach((data: unknown) => {
      const row = data as Record<string, unknown>;
      if (this.selected.includes(Number(row['id']))) {
        const permission = this.tableConfig?.rowActions?.find(
          action => action.actionToPerform === 'edit',
        )?.permission;

        if (typeof permission === 'string' && this.permissions?.includes(permission)) {
          status = true;
        }
      }
    });

    return status;
  }

  // For Date Picker

  onDateSelection(date: NgbDate): void {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date?.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

    const params = {
      start_date: `${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`,
      end_date: this.toDate
        ? `${this.toDate.year}-${this.toDate.month}-${this.toDate.day}`
        : undefined,
    };

    this.onChangeTable(params, 'daterange');
  }

  isHovered(date: NgbDate): boolean {
    return (
      this.fromDate !== null &&
      this.toDate === null &&
      this.hoveredDate !== null &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate): boolean {
    return (
      this.toDate !== null &&
      this.fromDate !== null &&
      date.after(this.fromDate) &&
      date.before(this.toDate)
    );
  }

  isRange(date: NgbDate): boolean {
    return (
      date.equals(this.fromDate) ||
      (this.toDate !== null && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

  clearDateRange(): void {
    this.fromDate = null;
    this.toDate = null;
    this.onChangeTable(null, 'daterange');
  }

  // ========== HELPERS POUR LE TEMPLATE ==========

  getDataField(columnHead: ITableColumn): string {
    return columnHead?.dataField ?? '';
  }

  getColumnValue(columnData: any, columnHead: ITableColumn): any {
    return columnData[this.getDataField(columnHead)];
  }


  getImageUrl(columnData: any, columnHead: ITableColumn): string {
    const value = this.getColumnValue(columnData, columnHead);
    if (value && typeof value === 'object' && 'original_url' in value) {
      return (value as { original_url: string }).original_url;
    }
    return String(value ?? '');
  }

  onImageError(event: Event, columnHead: ITableColumn): void {
    const img = event.target as HTMLImageElement;
    img.src = columnHead?.placeholder || 'assets/images/no-image.png';
  }

  getInitial(columnData: any, columnHead: ITableColumn): string {
    const key = columnHead?.key ?? 'name';
    const value = String(columnData[key] ?? 'F');
    return value.charAt(0).toUpperCase();
  }

  getOrderStatusClass(columnData: any, columnHead: ITableColumn): Record<string, boolean> {
    const value = String(this.getColumnValue(columnData, columnHead) ?? '');
    return {
      'bg-warning text-dark': value === 'pending',
      'bg-info text-white': value === 'confirmed',
      'bg-primary text-white': value === 'processing',
      'bg-secondary text-white': value === 'shipped',
      'bg-success text-white': value === 'delivered',
      'bg-danger text-white': value === 'cancelled',
    };
  }

  getSwitchValue(columnData: any, columnHead: ITableColumn): number {
    const value = this.getColumnValue(columnData, columnHead);
    return (value === '1' || value === true) ? 0 : 1;
  }

  isSwitchChecked(columnData: any, columnHead: ITableColumn): boolean {
    const value = this.getColumnValue(columnData, columnHead);
    return value === '1' || value === true;
  }

  onSwitchClick(event: Event, columnHead: ITableColumn, columnData: any): void {
    event.preventDefault();
    event.stopPropagation();
    const value = this.getSwitchValue(columnData, columnHead);
    this.confirmationModal().openModal(
      this.getDataField(columnHead),
      columnData,
      value,
    );
  }

  getBadgeClass(columnData: any, columnHead: ITableColumn): Record<string, boolean> {
    const value = String(this.getColumnValue(columnData, columnHead) ?? '');
    return {
      'badge-success': value === 'Actif',
      'badge-danger': value === 'Bloqué',
      'badge-secondary': value !== 'Actif' && value !== 'Bloqué',
    };
  }

  getBadgeColor(columnData: any, columnHead: ITableColumn): string {
    if (columnHead?.colorField) {
      return String(columnData[columnHead.colorField] ?? '#3B82F6');
    }
    return '#3B82F6';
  }

  getNumberBadgeClass(columnData: any, columnHead: ITableColumn): Record<string, boolean> {
    const value = Number(this.getColumnValue(columnData, columnHead) ?? 0);
    return {
      'badge-success': value > 0,
      'badge-secondary': value === 0,
    };
  }

  getTooltipText(columnData: any, columnHead: ITableColumn): string {
    const value = String(this.getColumnValue(columnData, columnHead) ?? '');
    const maxLength = columnHead?.maxLength ?? 0;
    return value.length > maxLength ? value : '';
  }

  getTruncatedText(columnData: any, columnHead: ITableColumn): string {
    const value = String(this.getColumnValue(columnData, columnHead) ?? '');
    const maxLength = columnHead?.maxLength ?? 0;
    if (value.length > maxLength) {
      return value.slice(0, maxLength) + '...';
    }
    return value;
  }

  getColspan(): number {
    const base = this.tableConfig?.columns?.length ?? 0;
    const hasActions = (this.tableConfig?.rowActions?.length ?? 0) > 0;
    const checkboxOffset = this.hasCheckbox ? 1 : 0;
    const actionsOffset = hasActions ? 1 : 0;
    return base + checkboxOffset + actionsOffset;
  }

  onDuplicateClick(event: Event, selectedItems: number[]): void {
    event.preventDefault();
    event.stopPropagation();
    this.confirmationModal().openModal('duplicate', selectedItems);
  }

  onActionClick(action: ITableAction, columnData: any): void {
    if (action.actionToPerform === 'delete') {
      this.deleteModal().openModal('delete', columnData);
    } else {
      this.onActionClicked(action.actionToPerform, columnData);
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'loader-none');
    this.destroy$.next();
    this.destroy$.complete();
  }
}

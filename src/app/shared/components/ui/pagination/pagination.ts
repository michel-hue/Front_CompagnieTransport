//import { NgClass } from '@angular/common';
import { Component, Input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';

import { IPaginate } from '../../../interface/paginate.interface';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.scss'],
  imports: [],
})
export class Pagination implements OnInit, OnChanges {
  @Input() total: number = 0;
  @Input() currentPage: number = 1;
  @Input() pageSize: number = 10;

  readonly setPage = output<number>();

  public paginate!: IPaginate;

  ngOnInit(): void {
    this.paginate = this.getPager(this.total, this.currentPage, this.pageSize);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.paginate = this.getPager(this.total, this.currentPage, this.pageSize);
  }

  pageSet(page: number): void {
    this.setPage.emit(page);
  }

  private getPager(totalItems: number, currentPage: number, pageSize: number): IPaginate {
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const paginateRange = 3;

    const clampedPage = Math.max(1, Math.min(currentPage, totalPages));

    let startPage: number;
    let endPage: number;

    if (totalPages <= paginateRange) {
      startPage = 1;
      endPage = totalPages;
    } else if (clampedPage <= Math.floor(paginateRange / 2)) {
      startPage = 1;
      endPage = paginateRange;
    } else if (clampedPage >= totalPages - Math.floor(paginateRange / 2)) {
      startPage = totalPages - paginateRange + 1;
      endPage = totalPages;
    } else {
      startPage = clampedPage - Math.floor(paginateRange / 2);
      endPage = clampedPage + Math.floor(paginateRange / 2);
    }

    const startIndex = (clampedPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    const pages = Array.from(
      { length: endPage + 1 - startPage },
      (_, i) => startPage + i,
    );

    return {
      totalItems,
      currentPage: clampedPage,
      pageSize,
      totalPages,
      startPage,
      endPage,
      startIndex,
      endIndex,
      pages,
    };
  }
}

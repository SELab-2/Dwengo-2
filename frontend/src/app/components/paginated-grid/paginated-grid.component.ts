import { Component, Input, TemplateRef, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getCustomPaginatorIntl } from './custom-paginator-intl';

const standardPageSizeOptions = [6, 8, 10, 12, 15, 20]; // the standard available page sizes the user can select from
const standardPageSize = 12; // the default page size when the component is loaded

@Component({
  selector: 'app-paginated-grid',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './paginated-grid.component.html',
  styleUrls: ['./paginated-grid.component.less'],
  providers: [
    {
      provide: MatPaginatorIntl,
      useFactory: getCustomPaginatorIntl,
    }
  ]
})
export class PaginatedGridComponent<T extends { id: string | number }> implements OnChanges {
  @Input() items: T[] = [];
  @Input() pageSizeOptions: number[] = standardPageSizeOptions; // Page size options for the paginator
  @Input() showPageSizeOptions: boolean = true; // Show page size options in the paginator
  @Input() showPagination: boolean = true; // Show pagination controls
  @Input() pageSize: number = standardPageSize;
  @Input() itemTemplate!: TemplateRef<unknown>; // Template for projecting item cards

  pagedItems: T[] = [];
  pageIndex = 0;

  ngOnChanges(): void {
    this.updatePagedItems();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePagedItems();
  }

  private updatePagedItems() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedItems = this.items.slice(start, end);
  }
}

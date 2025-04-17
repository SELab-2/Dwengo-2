import { Component, Input, TemplateRef, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getCustomPaginatorIntl } from './custom-paginator-intl';

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
  @Input() pageSizeOptions: number[] = [6, 8, 10, 12, 15, 20];
  @Input() showPageSizeOptions: boolean = true; // Show page size options in the paginator
  @Input() pageSize: number = 12;
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

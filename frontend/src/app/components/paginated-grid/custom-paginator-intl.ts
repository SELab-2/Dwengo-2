import { MatPaginatorIntl } from '@angular/material/paginator';

export function getCustomPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = $localize`:@@itemsPerPage:Items per page:`;
  paginatorIntl.nextPageLabel = $localize`:@@nextPage:Next page`;
  paginatorIntl.previousPageLabel = $localize`:@@previousPage:Previous page`;
  paginatorIntl.firstPageLabel = $localize`:@@firstPage:First page`;
  paginatorIntl.lastPageLabel = $localize`:@@lastPage:Last page`;
  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return $localize`:@@rangeLabel:0 of ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return $localize`:@@rangeLabel:${startIndex + 1} – ${endIndex} of ${length}`;
  };

  return paginatorIntl;
}
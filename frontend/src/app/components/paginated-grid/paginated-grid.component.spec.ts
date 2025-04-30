import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginatedGridComponent } from './paginated-grid.component';
import { By } from '@angular/platform-browser';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

interface TestItem {
  id: number;
  name: string;
}

// Host component to inject template and test data
@Component({
  template: `
    <ng-template #card let-item>
      <div class="card">{{ item.name }}</div>
    </ng-template>

    <app-paginated-grid
      [items]="items"
      [pageSize]="pageSize"
      [showPagination]="showPagination"
      [itemTemplate]="card">
    </app-paginated-grid>
  `,
  standalone: true,
  imports: [PaginatedGridComponent, CommonModule, MatPaginatorModule],
})
class TestHostComponent {
  @ViewChild(PaginatedGridComponent) gridComponent!: PaginatedGridComponent<TestItem>;

  items: TestItem[] = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    name: `Item ${i}`
  }));
  pageSize = 5;
  showPagination = true;
}

describe('PaginatedGridComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should create the component', () => {
    expect(hostComponent.gridComponent).toBeTruthy();
  });

  it('should render the first page of items', () => {
    const renderedCards = hostFixture.debugElement.queryAll(By.css('.card'));
    expect(renderedCards.length).toBe(5);
    expect(renderedCards[0].nativeElement.textContent).toContain('Item 0');
    expect(renderedCards[4].nativeElement.textContent).toContain('Item 4');
  });

  it('should paginate to the second page correctly', () => {
    hostComponent.gridComponent.onPageChange({ pageIndex: 1, pageSize: 5, length: 15 } as PageEvent);
    hostFixture.detectChanges();

    const renderedCards = hostFixture.debugElement.queryAll(By.css('.card'));
    expect(renderedCards.length).toBe(5);
    expect(renderedCards[0].nativeElement.textContent).toContain('Item 5');
  });

  it('should show the paginator by default', () => {
    const paginator = hostFixture.debugElement.query(By.css('mat-paginator'));
    expect(paginator).toBeTruthy();
  });

  it('should hide the paginator when showPagination is false', () => {
    hostComponent.showPagination = false;
    hostFixture.detectChanges();

    const paginator = hostFixture.debugElement.query(By.css('mat-paginator'));
    expect(paginator).toBeNull();
  });

  it('should display "No items found" when items are empty', () => {
    hostComponent.items = [];
    hostFixture.detectChanges();

    const message = hostFixture.debugElement.query(By.css('p'));
    expect(message.nativeElement.textContent).toContain('No items found.');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSkeletonLoaderComponent } from './card-skeleton-loader.component';

describe('CardSkeletonLoaderComponent', () => {
  let component: CardSkeletonLoaderComponent;
  let fixture: ComponentFixture<CardSkeletonLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSkeletonLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardSkeletonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

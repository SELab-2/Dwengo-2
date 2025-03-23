import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthenticatedHeaderComponent } from './unauthenticated-header.component';

describe('UnauthenticatedHeaderComponent', () => {
  let component: UnauthenticatedHeaderComponent;
  let fixture: ComponentFixture<UnauthenticatedHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthenticatedHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnauthenticatedHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

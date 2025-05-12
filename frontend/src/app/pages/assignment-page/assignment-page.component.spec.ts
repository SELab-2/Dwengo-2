import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentPageComponent } from './assignment-page.component';

describe('AssignmentPageComponent', () => {
  let component: AssignmentPageComponent;
  let fixture: ComponentFixture<AssignmentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

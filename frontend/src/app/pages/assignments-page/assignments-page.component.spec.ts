import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentsPageComponent } from './assignments-page.component';

describe('AssignmentsPageComponent', () => {
  let component: AssignmentsPageComponent;
  let fixture: ComponentFixture<AssignmentsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

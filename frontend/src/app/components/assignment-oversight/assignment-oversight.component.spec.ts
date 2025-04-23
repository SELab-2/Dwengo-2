import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentOversightComponent } from './assignment-oversight.component';

describe('AssignmentOversightComponent', () => {
  let component: AssignmentOversightComponent;
  let fixture: ComponentFixture<AssignmentOversightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentOversightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentOversightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

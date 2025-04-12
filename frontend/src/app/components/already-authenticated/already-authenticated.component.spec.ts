import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyAuthenticatedComponent } from './already-authenticated.component';

describe('AlreadyAuthenticatedComponent', () => {
  let component: AlreadyAuthenticatedComponent;
  let fixture: ComponentFixture<AlreadyAuthenticatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlreadyAuthenticatedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlreadyAuthenticatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

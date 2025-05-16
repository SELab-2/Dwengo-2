import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestClassModalComponent } from './request-class-modal.component';
import { MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from "@angular/common/http";


describe('RequestClassModalComponent', () => {
  let component: RequestClassModalComponent;
  let fixture: ComponentFixture<RequestClassModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestClassModalComponent],
      providers: [
        {
            provide: MatDialogRef,
            useValue: {
                close: jasmine.createSpy('close') // Mock
            }
        },
        provideHttpClient(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestClassModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

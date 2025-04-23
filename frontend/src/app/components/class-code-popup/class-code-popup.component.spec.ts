import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ClassCodePopupComponent } from "./class-code-popup.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe('ClassCodePopupComponent', () => {
  let component: ClassCodePopupComponent;
  let fixture: ComponentFixture<ClassCodePopupComponent>;
  const classCode: string = '123456'; // Mock class code

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassCodePopupComponent],
      providers: [
        {
            provide: MatDialogRef,
            useValue: {
                close: jasmine.createSpy('close') // Mock
            }
        },
        {
            provide: MAT_DIALOG_DATA,
            useValue: {
                classCode: classCode
            }
        }
      ]
    })
    .compileComponents();

    // Dependency injection
    TestBed.inject(MatDialog);
    TestBed.inject(MAT_DIALOG_DATA);

    fixture = TestBed.createComponent(ClassCodePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog when close() is called', () => {
    component.close();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should contain the class code', () => {
    const classCode = fixture.nativeElement.querySelector('h1').textContent;
    expect(classCode).toContain(classCode);
  });

  it('should contain the class code in the dialog data', () => {
    expect(component.data.classCode).toBe(classCode);
  });

  it('should have a close button', () => {
    const closeButton = fixture.nativeElement.querySelector('button');
    expect(closeButton).toBeTruthy();
  })
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LearningPathFilterComponent } from './learning-path-filter.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

describe('LearningPathFilterComponent', () => {
  let component: LearningPathFilterComponent;
  let fixture: ComponentFixture<LearningPathFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LearningPathFilterComponent,
        NoopAnimationsModule,
        ReactiveFormsModule // Add this if not already imported by the component
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LearningPathFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(component.filterForm).toBeDefined();
  });

  it('should emit filtersApplied with correct values when Apply Filters is clicked', () => {
    // Set form values directly
    component.filterForm.setValue({
      minAge: 10,
      maxAge: 18,
      language: 'en',
      searchTerm: 'math'
    });

    fixture.detectChanges();

    spyOn(component.filtersApplied, 'emit');

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    expect(component.filtersApplied.emit).toHaveBeenCalledWith({
      minAge: 10,
      maxAge: 18,
      language: 'en',
      searchTerm: 'math'
    });
  });

  it('should initialize with empty/null values', () => {
    expect(component.filterForm.value).toEqual({
      minAge: null,
      maxAge: null,
      language: '',
      searchTerm: ''
    });
  });

  it('should update form values when inputs change', () => {
    const minAgeInput = fixture.debugElement.query(By.css('input[formControlName="minAge"]'));
    const maxAgeInput = fixture.debugElement.query(By.css('input[formControlName="maxAge"]'));
    const searchInput = fixture.debugElement.query(By.css('input[formControlName="searchTerm"]'));

    minAgeInput.nativeElement.value = '12';
    minAgeInput.nativeElement.dispatchEvent(new Event('input'));

    maxAgeInput.nativeElement.value = '16';
    maxAgeInput.nativeElement.dispatchEvent(new Event('input'));

    searchInput.nativeElement.value = 'science';
    searchInput.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.filterForm.value).toEqual({
      minAge: 12,
      maxAge: 16,
      language: '',
      searchTerm: 'science'
    });
  });
});
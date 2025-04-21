import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LearningPathFilterComponent } from './learning-path-filter.component';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LearningPathFilterComponent', () => {
  let component: LearningPathFilterComponent;
  let fixture: ComponentFixture<LearningPathFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningPathFilterComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LearningPathFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filtersApplied with correct values when Apply Filters is clicked', () => {
    // Vul component properties in
    component.minAge = 10;
    component.maxAge = 18;
    component.language = 'en';
    component.searchTerm = 'math';

    fixture.detectChanges();

    spyOn(component.filtersApplied, 'emit');

    // Zoek en klik op de knop
    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    expect(component.filtersApplied.emit).toHaveBeenCalledWith({
      minAge: 10,
      maxAge: 18,
      language: 'en',
      searchTerm: 'math'
    });
  });
});

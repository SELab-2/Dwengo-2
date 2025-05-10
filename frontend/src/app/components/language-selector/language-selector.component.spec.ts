import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSelectorComponent } from './language-selector.component';
import { Location } from '@angular/common';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;
  let mockLocation: {path: () => string};

  beforeEach(async () => {
    mockLocation = {
      path: () => '/en-US',
    };

    await TestBed.configureTestingModule({
      imports: [LanguageSelectorComponent],
      providers: [
        { provide: Location, useValue: mockLocation }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ngOnInit should set locale and flag from URL', () => {
    component.ngOnInit();
    expect(component.currentLocale).toBe('en-US');
    expect(component.currentFlag).toBe('us');
  });
});

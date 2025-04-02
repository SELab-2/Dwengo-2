import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MiniClassComponent } from './mini-class.component';
import { Class } from '../../interfaces/classes/class';
import { By } from '@angular/platform-browser';

describe('MiniClassComponent', () => {
  let component: MiniClassComponent;
  let fixture: ComponentFixture<MiniClassComponent>;
  let testClass: Class;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniClassComponent],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniClassComponent);
    component = fixture.componentInstance;

    // @Input()
    testClass = {
        name: "TestMath",
        description: "This is a test class",
        targetAudience: "Testers",
        teacherId: "123",
        id: "123"
    }
    component._class = testClass;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a class', () => {
    expect(component._class).toBeDefined();
  });

  it('should have a class name', () => {
    const name = fixture.debugElement.query(By.css("#class-title"));
    expect(name).toBeDefined();
  });

  it('should have a class description', () => {
    const description = fixture.nativeElement.querySelector('p[id="class-description"]');
    expect(description).toBeDefined();
  });

  it('should have a target audience', () => {
    const audience = fixture.nativeElement.querySelector('p[id="class-target-audience"]');
    expect(audience).toBeDefined();
  });

});

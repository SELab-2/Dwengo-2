import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MiniClassComponent } from './mini-class.component';
import { Class } from '../../interfaces/classes/class';

describe('MiniClassComponent', () => {
  let component: MiniClassComponent;
  let fixture: ComponentFixture<MiniClassComponent>;

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

    const testClass: Class = {
        name: "TestMath",
        description: "This is a test class",
        targetAudience: "Testers",
        teacherId: "123",
        classId: "123"
    }
    component._class = testClass;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

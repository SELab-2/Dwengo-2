import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { CreateTaskComponent } from './create-task.component';
import { TaskType } from '../../../interfaces/tasks';

describe('CreateNormalTaskComponent', () => {
    let component: CreateTaskComponent;
    let fixture: ComponentFixture<CreateTaskComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CreateTaskComponent,
                FormsModule,
                ReactiveFormsModule,
                MatCardModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                BrowserAnimationsModule,
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CreateTaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should display the start button on initialization', () => {
        const button = fixture.debugElement.query(By.css('button[mat-fab]')).nativeElement;
        expect(button).toBeTruthy();
    });

    it('should show multiple choice when selected', () => {
        component.start();
        component.select('MULTIPLECHOICE');
        fixture.detectChanges();

        expect(component.ready).toBeTrue();
        expect(component.selected).toBe(TaskType.MULTIPLECHOICE);
    });

    it('should go back when back-button is pressed', () => {
        component.start();
        component.select('MULTIPLECHOICE');
        component.back();

        fixture.detectChanges();
        expect(component.selected).toBe(undefined);

        component.back();

        fixture.detectChanges();
        expect(component.ready).toBeFalse();
    });
});

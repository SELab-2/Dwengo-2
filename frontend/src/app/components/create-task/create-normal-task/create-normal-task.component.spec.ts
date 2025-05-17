import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateNormalTaskComponent } from './create-normal-task.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { NormalQuestion } from '../../../interfaces/assignment/tasks';
import { TaskType } from '../../../interfaces/tasks';

describe('CreateNormalTaskComponent', () => {
    let component: CreateNormalTaskComponent;
    let fixture: ComponentFixture<CreateNormalTaskComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CreateNormalTaskComponent,
                FormsModule,
                ReactiveFormsModule,
                MatCardModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                BrowserAnimationsModule,
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CreateNormalTaskComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should disable submit button if question is empty', () => {
        const button = fixture.debugElement.query(By.css('button[mat-fab]')).nativeElement;
        expect(button.disabled).toBeTrue();
    });

    it('should enable submit button if question is filled', () => {
        component.title.setValue('Wat is de hoofdstad van België?');
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('button[mat-fab]')).nativeElement;
        expect(button.disabled).toBeFalse();
    });

    it('should emit the question when submitted', () => {
        spyOn(component.taskCreated, 'emit');
        component.title.setValue('Wat is 2 + 2?');
        component.predefined_answer.setValue('4');

        component.submitQuestion();

        expect(component.taskCreated.emit).toHaveBeenCalledWith({
            question: 'Wat is 2 + 2?',
            predefined_answer: '4',
            type: TaskType.NORMALQUESTION
        } as NormalQuestion);
    });

    it('should disable and enable title field correctly', () => {
        component.ready();
        expect(component.title.disabled).toBeTrue();
        expect(component.edit).toBeFalse();

        component.setEdit();
        expect(component.title.enabled).toBeTrue();
        expect(component.edit).toBeTrue();
    });

    it('should hide answer input field when checkbox is unchecked', () => {
        component.update(false);
        fixture.detectChanges();

        const answerInput = fixture.debugElement.query(By.css('input[formControlName="predefined_answer"]'));
        expect(answerInput).toBeNull();
    });
});

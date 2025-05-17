import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { MultipleChoiceSubmissionComponent } from './multiple-choice-submission.component';
import { TaskType } from '../../../interfaces/tasks';


describe('CreateSubmissionComponent', () => {
    let component: MultipleChoiceSubmissionComponent;
    let fixture: ComponentFixture<MultipleChoiceSubmissionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MultipleChoiceSubmissionComponent, MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCardModule],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MultipleChoiceSubmissionComponent);
        component = fixture.componentInstance;
        component.choiceObject = {
            question: 'Test Question?',
            allowMultipleAnswers: false,
            options: ['Test answer 1', 'Test answer 2', 'Test answer 3'],
            correctAnswers: [5],
            selected: [1, 2],
            type: TaskType.MULTIPLECHOICE
        }
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should disable the button when multiple options are selected, but only one is expected', () => {
        // Base behaviour should disable this
        const button = fixture.debugElement.query(By.css('button[mat-fab]')).nativeElement;
        expect(button.disabled).toBeTrue();
    });

    it('should enalbe the button when one option is selected', () => {
        // Base behaviour has two options selected, 'click' one again
        component.update(false, 1);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button[mat-fab]')).nativeElement;
        expect(button.disabled).toBeFalse();
    });
});

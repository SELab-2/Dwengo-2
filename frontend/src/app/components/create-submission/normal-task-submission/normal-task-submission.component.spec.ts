import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NormalTaskSubmissionComponent } from './normal-task-submission.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { TaskType } from '../../../interfaces/tasks';


describe('CreateSubmissionComponent', () => {
    let component: NormalTaskSubmissionComponent;
    let fixture: ComponentFixture<NormalTaskSubmissionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NormalTaskSubmissionComponent, MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatCardModule],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NormalTaskSubmissionComponent);
        component = fixture.componentInstance;
        component.taskObject = {
            question: 'Test Question?',
            predefined_answer: 'Test Answer',
            answer: '',
            type: TaskType.NORMALQUESTION,
        }
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should enable the Submit button when an answer is provided', () => {
        component.answer.setValue('Test Answer');
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button[mat-fab]')).nativeElement;
        expect(button.disabled).toBeFalse();
    });

    it('should disable the Submit button when an answer is provided', () => {
        component.taskObject.answer = '';
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button[mat-fab]')).nativeElement;
        expect(button.disabled).toBeTrue();
    });
});

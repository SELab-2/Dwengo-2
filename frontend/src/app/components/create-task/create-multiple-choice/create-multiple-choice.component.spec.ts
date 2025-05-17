import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MultipleChoice } from '../../../interfaces/assignment/tasks';
import { CreateMultipleChoiceComponent } from './create-multiple-choice.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TaskType } from '../../../interfaces/tasks';

describe('CreateNormalTaskComponent', () => {
    let component: CreateMultipleChoiceComponent;
    let fixture: ComponentFixture<CreateMultipleChoiceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CreateMultipleChoiceComponent,
                FormsModule,
                ReactiveFormsModule,
                MatCardModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                MatCheckboxModule,
                BrowserAnimationsModule,
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CreateMultipleChoiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should allow multiple answers when button is clicked', () => {
        component.update(true);
        fixture.detectChanges()

        expect(component.allowMultipleOptions).toBeTrue();
    });

    it('should enable submit button if requirements are met', () => {
        component.title.setValue('Wat is de hoofdstad van België?');
        component.options = ["Option1", "Option2"];
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('button[mat-fab]')).nativeElement;
        expect(button.disabled).toBeFalse();
    });

    it('should emit the question when submitted', () => {
        spyOn(component.taskCreated, 'emit');
        component.title.setValue('Wat is 2 + 2?');
        component.options = ["Option1", "Option2"];
        component.allowMultipleOptions = false;
        component.correctAnswers = [false, true];

        fixture.detectChanges();
        component.submitQuestion();

        expect(component.taskCreated.emit).toHaveBeenCalledWith({
            question: 'Wat is 2 + 2?',
            options: ["Option1", "Option2"],
            allowMultipleAnswers: false,
            correctAnswers: [1],
            selected: [],
            type: TaskType.MULTIPLECHOICE
        } as MultipleChoice);
    });

    it('should be in able to add items to the option list', () => {
        component.newOption.setValue("New Option")
        component.addOption();
        fixture.detectChanges();
        expect(component.newOption.value).toEqual('');
        expect(component.options[0]).toEqual("New Option");
    });

    it('should be in able to delete an item', () => {
        component.options = ["1", "2", "3", "4", "5"]
        component.correctAnswers = [false, false, true, false, true]
        component.deleteOption(3);
        fixture.detectChanges();

        expect(component.options).toEqual(["1", "2", "3", "5"])
        expect(component.correctAnswers).toEqual([false, false, true, true])
    });
});

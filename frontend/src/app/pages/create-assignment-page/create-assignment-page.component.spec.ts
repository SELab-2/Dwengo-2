import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CreateAssignmentPageComponent } from './create-assignment-page.component';
import { MatCardModule } from '@angular/material/card';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';
import { CreateAssignmentComponent } from '../../components/create-assignment/create-assignment.component';
import { LearningPathComponent } from '../../components/learning-path/learning-path.component';

describe('CreateAssignmentPageComponent', () => {
    let component: CreateAssignmentPageComponent;
    let fixture: ComponentFixture<CreateAssignmentPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreateAssignmentPageComponent, MatCardModule, CreateAssignmentComponent, AuthenticatedHeaderComponent, LearningPathComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([])
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CreateAssignmentPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should hide the learning path when showGroups is emitted', () => {
        component.showGroups();

        fixture.detectChanges();

        expect(component.showLearningPath).toBeFalse();
    });
});

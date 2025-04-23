import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LearningPathListComponent } from './learning-path-list.component';
import { LearningPathInfoCardComponent } from '../learning-path-info-card/learning-path-info-card.component';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { LearningPath } from '../../../interfaces/learning-path/learningPath';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('LearningPathListComponent', () => {
    let component: LearningPathListComponent;
    let fixture: ComponentFixture<LearningPathListComponent>;

    const mockPaths: LearningPath[] = [
        {
            title: 'Math Basics',
            description: 'Learn addition and subtraction',
            numNodes: 6,
            minAge: 7,
            maxAge: 10,
            learningPathId: 'math101',
            language: 'en',
            id: 'id',
            hruid: 'hruid',
        },
        {
            title: 'Science 101',
            description: 'Basic physics and chemistry',
            numNodes: 8,
            minAge: 10,
            maxAge: 13,
            learningPathId: 'sci101',
            language: 'nl',
            id: 'id',
            hruid: 'hruid',
        }
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LearningPathListComponent, MatCardModule],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({}),
                        snapshot: {},
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LearningPathListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should display the provided title', () => {
        component.title = 'Custom Title';
        fixture.detectChanges();

        const titleEl = fixture.nativeElement.querySelector('mat-card-title');
        expect(titleEl.textContent).toContain('Custom Title');
    });

    it('should render a list of LearningPathInfoCardComponents', () => {
        component.learningPaths = mockPaths;
        fixture.detectChanges();

        const cards = fixture.debugElement.queryAll(By.directive(LearningPathInfoCardComponent));
        expect(cards.length).toBe(2);
    });

    it('should bind the correct data to LearningPathInfoCardComponent', () => {
        component.learningPaths = [mockPaths[0]];
        component.isTeacher = true;
        fixture.detectChanges();

        const cardDebugEl = fixture.debugElement.query(By.directive(LearningPathInfoCardComponent));
        const cardInstance = cardDebugEl.componentInstance as LearningPathInfoCardComponent;

        expect(cardInstance.title).toBe('Math Basics');
        expect(cardInstance.description).toBe('Learn addition and subtraction');
        expect(cardInstance.steps).toBe(6);
        expect(cardInstance.minAge).toBe(7);
        expect(cardInstance.maxAge).toBe(10);
        expect(cardInstance.learningPathId).toBe('math101');
        expect(cardInstance.isTeacher).toBe(true);
    });

    it('should display a message when there are no learning paths', () => {
        component.learningPaths = [];
        fixture.detectChanges();

        const fallbackMessage = fixture.nativeElement.querySelector('p');
        expect(fallbackMessage.textContent).toContain('There are no learning paths available for this category');
    });
});

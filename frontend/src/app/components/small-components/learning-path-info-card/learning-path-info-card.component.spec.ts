import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LearningPathInfoCardComponent } from './learning-path-info-card.component';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('LearningPathInfoCardComponent', () => {
    let component: LearningPathInfoCardComponent;
    let fixture: ComponentFixture<LearningPathInfoCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LearningPathInfoCardComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of({ get: (key: string) => 'explore' }),
                        snapshot: {
                            paramMap: {
                                get: () => 'some-id'
                            }
                        }
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LearningPathInfoCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display title and truncated description', () => {
        component.title = 'Algebra 101';
        component.description = 'very long test description to test if everything after length 100 will be cut out. test test test test test test test test test test test test test test test test test test test test test test';
        component.steps = 8;
        component.minAge = 10;
        component.maxAge = 15;
        component.learningPathId = 'abc123';
        component.isTeacher = false;

        component.checkDescriptionLength();

        fixture.detectChanges();

        const title = fixture.nativeElement.querySelector('mat-card-title');
        const desc = fixture.nativeElement.querySelector('.description');
        expect(title.textContent).toContain('Algebra 101');
        expect(desc.textContent.length).toBeLessThan(110); // truncated
        expect(desc.textContent).toContain('...');
    });

    it('should show teacher button when isTeacher is true', () => {
        component.isTeacher = true;
        component.title = 'Test';
        component.description = 'Short description';
        component.learningPathId = 'lp1';
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('button[mat-icon-button]'));
        expect(button).toBeTruthy();
    });

    it('should not show teacher button when isTeacher is false', () => {
        component.isTeacher = false;
        component.title = 'Test';
        component.description = 'Short description';
        component.learningPathId = 'lp1';
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('button[mat-icon-button]'));
        expect(button).toBeNull();
    });

    it('should navigate to correct learning path URL', () => {
        component.learningPathId = 'xyz456';
        component.title = 'Test';
        component.description = 'Short description';
        fixture.detectChanges();

        const card = fixture.debugElement.query(By.css('mat-card'));
        expect(card.attributes['ng-reflect-router-link']).toContain('/learning-path/xyz456');
    });
});

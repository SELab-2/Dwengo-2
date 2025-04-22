import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExploreComponent } from './explore.component';
import { AuthenticationService } from '../../services/authentication.service';
import { LearningPathService } from '../../services/learningPath.service';
import { of, throwError } from 'rxjs';
import { LearningPath, LearningPathResponse } from '../../interfaces/learning-path';
import { LearningPathListComponent } from '../small-components/learning-path-list/learning-path-list.component';
import { LoadingComponent } from '../loading/loading.component';
import { FormsModule } from '@angular/forms';
import { LearningPathFilterComponent } from '../small-components/learning-path-filter/learning-path-filter.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { UserType } from '../../interfaces';

describe('ExploreComponent', () => {
  let component: ExploreComponent;
  let fixture: ComponentFixture<ExploreComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let pathServiceSpy: jasmine.SpyObj<LearningPathService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthenticationService', ['retrieveUserType']);
    const lpSpy = jasmine.createSpyObj('LearningPathService', ['retrieveLearningPathsByQuery']);

    await TestBed.configureTestingModule({
      imports: [
        ExploreComponent,
        LearningPathListComponent,
        LoadingComponent,
        FormsModule,
        LearningPathFilterComponent,
        MatCardModule,
        MatButtonModule
      ],
      providers: [
        { provide: AuthenticationService, useValue: authSpy },
        { provide: LearningPathService, useValue: lpSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExploreComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    pathServiceSpy = TestBed.inject(LearningPathService) as jasmine.SpyObj<LearningPathService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect teacher type on init', () => {
    authServiceSpy.retrieveUserType.and.returnValue(UserType.TEACHER);
    component.ngOnInit();
    expect(component.isTeacher).toBeTrue();
  });

  it('should load regular selection when BASIC is visualized', () => {
    const mockResponse = {
      learningPaths: [{ learningPathId: '1', title: 'Path 1', minAge: 10, maxAge: 16, language: "en", description: "test", numNodes: 5 } as LearningPath]
    } as LearningPathResponse;
    pathServiceSpy.retrieveLearningPathsByQuery.and.returnValue(of(mockResponse));
    component.setBasic();

    expect(component.visualize).toBe('BASIC');
    expect(pathServiceSpy.retrieveLearningPathsByQuery).toHaveBeenCalledTimes(component.categories.length);
  });

  it('should handle error during data fetch', () => {
    spyOn(console, 'error');
    pathServiceSpy.retrieveLearningPathsByQuery.and.returnValue(throwError(() => new Error('Failed')));
    component.setBasic();
    expect(console.error).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should apply filters and map the result', () => {
    const mockPaths: LearningPath[] = [
      { learningPathId: '1', title: 'Path A', minAge: 12, maxAge: 18, description: "testdescr", numNodes: 5, language: "nl" }
    ];

    pathServiceSpy.retrieveLearningPathsByQuery.and.returnValue(of({ learningPaths: mockPaths }));
    component.setCustom({ minAge: 10, maxAge: 18, language: 'en', searchTerm: '' });

    expect(component.visualize).toBe('CUSTOM');
    expect(component.data.length).toBe(1);
    expect(component.data[0].category).toBe('query');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LearningPathComponent } from './learning-path.component';
import { AuthenticationService } from '../../services/authentication.service';
import { LearningObjectService } from '../../services/learningObject.service';
import { LearningPathService } from '../../services/learningPath.service';
import { GraphBuilderService } from '../../services/graph-builder.service';
import { of } from 'rxjs';
import { UserType } from '../../interfaces';
import { LearningObject } from '../../interfaces/learning-object';
import { LearningPath } from '../../interfaces/learning-path';
import { DirectedGraph } from '../../datastructures/directed-graph';

describe('LearningPathComponent', () => {
    let component: LearningPathComponent;
    let fixture: ComponentFixture<LearningPathComponent>;

    let mockAuthService: jasmine.SpyObj<AuthenticationService>;
    let mockLearningObjectService: jasmine.SpyObj<LearningObjectService>;
    let mockLearningPathService: jasmine.SpyObj<LearningPathService>;
    let mockGraphBuilderService: jasmine.SpyObj<GraphBuilderService>;

    beforeEach(async () => {
        mockAuthService = jasmine.createSpyObj('AuthenticationService', ['retrieveUserType']);
        mockLearningObjectService = jasmine.createSpyObj('LearningObjectService', ['retrieveObjectsForLearningPath']);
        mockLearningPathService = jasmine.createSpyObj('LearningPathService', ['retrieveOneLearningPath']);
        mockGraphBuilderService = jasmine.createSpyObj('GraphBuilderService', ['buildTrajectoryGraph']);

        await TestBed.configureTestingModule({
            imports: [LearningPathComponent],
            providers: [
                { provide: AuthenticationService, useValue: mockAuthService },
                { provide: LearningObjectService, useValue: mockLearningObjectService },
                { provide: LearningPathService, useValue: mockLearningPathService },
                { provide: GraphBuilderService, useValue: mockGraphBuilderService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LearningPathComponent);
        component = fixture.componentInstance;

        // Zet verplichte inputs
        component.language = 'en';
        component.hruid = 'path-xyz';
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should fetch learning path and objects and build graph', () => {
        const mockObjects: LearningObject[] = [
            {
                id: 'obj1',
                metadata: { title: 'Title 1', language: 'en' },
                htmlContent: '<p>Hello</p>',
                /* eslint-disable  @typescript-eslint/no-explicit-any */
            } as any

        ];

        const mockPath: LearningPath = {
            id: 'lp1',
            title: 'Mock Path',
            nodes: [{ id: 'obj1' }] as any
        } as any;

        const mockGraph = {
            root: { value: mockObjects[0] }
        } as DirectedGraph<LearningObject>;

        mockAuthService.retrieveUserType.and.returnValue(UserType.TEACHER);
        mockLearningObjectService.retrieveObjectsForLearningPath.and.returnValue(of(mockObjects));
        mockLearningPathService.retrieveOneLearningPath.and.returnValue(of(mockPath));
        mockGraphBuilderService.buildTrajectoryGraph.and.returnValue(mockGraph);

        fixture.detectChanges(); // Triggers ngOnInit

        expect(component.isTeacher).toBeTrue();
        expect(component.learningObjects).toEqual(mockObjects);
        expect(component.path).toEqual(mockPath);
        expect(component.trajectoryGraph).toEqual(mockGraph);
        expect(component.selectedNode).toEqual(mockGraph.root);
        expect(component.loading).toBeFalse();
    });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LearningObjectService } from './learningObject.service';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { LearningPathService } from './learningPath.service';
import { HtmlType, LearningObject, LearningObjectRequest } from '../interfaces/learning-object';
import { SpecificLearningPathRequest } from '../interfaces/learning-path';
import { of } from 'rxjs';

describe('LearningObjectService', () => {
    let service: LearningObjectService;
    let httpMock: HttpTestingController;

    const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['retrieveAuthenticationHeaders']);
    const errorServiceSpy = jasmine.createSpyObj('ErrorService', ['pipeHandler', 'retrieveError']);
    const learningPathServiceSpy = jasmine.createSpyObj('LearningPathService', ['retrieveOneLearningPath']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                LearningObjectService,
                { provide: AuthenticationService, useValue: authServiceSpy },
                { provide: ErrorService, useValue: errorServiceSpy },
                { provide: LearningPathService, useValue: learningPathServiceSpy },
            ]
        });

        service = TestBed.inject(LearningObjectService);
        httpMock = TestBed.inject(HttpTestingController);

        authServiceSpy.retrieveAuthenticationHeaders.and.returnValue({});
        errorServiceSpy.pipeHandler.and.callFake(<T>() => (x: T): T => x);

    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should retrieve one learning object', () => {
        const query: LearningObjectRequest = {
            hruid: 'intro-to-robotics',
            htmlType: HtmlType.WRAPPED,
            language: 'en',
            version: 1
        };

        const response: LearningObject = {
            metadata: {
                hruid: 'intro-to-robotics',
                uuid: 'uuid-1',
                id: 'id-1',
                version: 1,
                language: 'en',
                title: 'Intro to Robotics',
                description: 'A beginner module',
                contentType: 'text/html'
            },
            htmlContent: '<p>Hello world</p>'
        };

        service.retrieveOneLearningObject(query).subscribe(obj => {
            expect(obj).toEqual(response);
        });

        const req = httpMock.expectOne(`${service['API_URL']}/learningObject/intro-to-robotics?type=wrapped&language=en&version=1`);
        expect(req.request.method).toBe('GET');
        req.flush(response);
    });

    it('should retrieve multiple learning objects', () => {
        const queries: LearningObjectRequest[] = [
            { hruid: 'obj1', htmlType: HtmlType.WRAPPED, language: 'en', version: 1 },
            { hruid: 'obj2', htmlType: HtmlType.WRAPPED, language: 'en', version: 2 }
        ];

        const responses: LearningObject[] = [
            {
                metadata: {
                    hruid: 'obj1',
                    uuid: 'uuid-obj1',
                    id: 'id-obj1',
                    version: 1,
                    language: 'en',
                    title: 'Object 1',
                    description: 'Desc 1',
                    contentType: 'text/html'
                },
                htmlContent: '<p>Content 1</p>'
            },
            {
                metadata: {
                    hruid: 'obj2',
                    uuid: 'uuid-obj2',
                    id: 'id-obj2',
                    version: 2,
                    language: 'en',
                    title: 'Object 2',
                    description: 'Desc 2',
                    contentType: 'text/html'
                },
                htmlContent: '<p>Content 2</p>'
            }
        ];

        service.retrieveMultipleLearningObjects(queries).subscribe(objs => {
            expect(objs).toEqual(responses);
        });

        httpMock.expectOne(`${service['API_URL']}/learningObject/obj1?type=wrapped&language=en&version=1`).flush(responses[0]);
        httpMock.expectOne(`${service['API_URL']}/learningObject/obj2?type=wrapped&language=en&version=2`).flush(responses[1]);
    });

    it('should retrieve objects for a learning path', () => {
        const request: SpecificLearningPathRequest = {
            hruid: 'robotics-path',
            language: 'en',
            includeNodes: false
        };

        const nodes = [
            {
                hruid: 'obj1',
                id: 'id-obj1',
                version: 1,
                language: 'en',
                startNode: true,
                transitions: { hruid: 'obj2', id: 'id-obj2', version: 1, language: 'en' }
            },
            {
                hruid: 'obj2',
                id: 'id-obj2',
                version: 1,
                language: 'en',
                startNode: false,
                transitions: { hruid: 'obj3', id: 'id-obj3', version: 1, language: 'en' }
            }
        ];

        learningPathServiceSpy.retrieveOneLearningPath.and.returnValue(of({
            title: 'Robotics Path',
            description: 'A learning path about robotics',
            numNodes: 2,
            minAge: 12,
            maxAge: 18,
            learningPathId: 'lp-robotics',
            language: 'en',
            hruid: 'robotics-path',
            id: 'lp-id-1',
            nodes: nodes // hier gebruik je de bestaande nodes
        }));


        const responses: LearningObject[] = nodes.map((node, i) => ({
            metadata: {
                hruid: node.hruid,
                uuid: `uuid-${i}`,
                id: node.id,
                version: node.version,
                language: node.language,
                title: `Title ${i}`,
                description: `Description ${i}`,
                contentType: 'text/html'
            },
            htmlContent: `<p>Content ${i}</p>`
        }));

        service.retrieveObjectsForLearningPath(request).subscribe(objs => {
            expect(objs.length).toBe(2);
            expect(objs[0].metadata.hruid).toBe('obj1');
            expect(objs[1].metadata.hruid).toBe('obj2');
        });

        httpMock.expectOne(`${service['API_URL']}/learningObject/obj1?type=wrapped&language=en&version=1`).flush(responses[0]);
        httpMock.expectOne(`${service['API_URL']}/learningObject/obj2?type=wrapped&language=en&version=1`).flush(responses[1]);
    });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';
import { LearningPathService } from './learningPath.service';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { LearningPathRequest, LearningPathResponse } from '../interfaces/learning-path';

describe('LearningPathService', () => {
    let service: LearningPathService;
    let httpMock: HttpTestingController;
    let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
    let errorServiceSpy: jasmine.SpyObj<ErrorService>;


    const mockHeaders = {
        headers: new HttpHeaders({
            Authorization: 'Bearer test-token'
        })
    };

    const mockResponse: LearningPathResponse = {
        learningPaths: [
            {
                title: 'Intro to AI',
                description: 'Basic intro to AI concepts',
                numNodes: 5,
                minAge: 12,
                maxAge: 18,
                learningPathId: 'lp-123',
                language: 'en',
                hruid: 'test',
                id: 'id',
            }
        ]
    };

    beforeEach(() => {
        authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['retrieveAuthenticationHeaders']);
        errorServiceSpy = jasmine.createSpyObj('ErrorService', ['pipeHandler', 'retrieveError']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                LearningPathService,
                { provide: AuthenticationService, useValue: authServiceSpy },
                { provide: ErrorService, useValue: errorServiceSpy }
            ]
        });

        service = TestBed.inject(LearningPathService);
        httpMock = TestBed.inject(HttpTestingController);

        authServiceSpy.retrieveAuthenticationHeaders.and.returnValue(mockHeaders);
        errorServiceSpy.pipeHandler.and.callFake(() => (source$) => source$);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should retrieve learning paths based on query', () => {
        const query: LearningPathRequest = {
            all: 'true',
            title: 'AI',
            hruid: 'hr123',
            language: 'en',
            description: 'intro'
        };

        service.retrieveLearningPathsByQuery(query).subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(
            req => req.method === 'GET' &&
                req.urlWithParams.includes('all=true') &&
                req.urlWithParams.includes('title=AI') &&
                req.urlWithParams.includes('hruid=hr123') &&
                req.urlWithParams.includes('language=en') &&
                req.urlWithParams.includes('description=intro')
        );

        expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
        req.flush(mockResponse);
    });

    it('should retrieve one learning path with query params', () => {
        const onePathQuery = {
            hruid: 'intro-ai',
            language: 'en',
            includeNodes: true
        };

        const onePathResponse = {
            title: 'Intro to AI',
            description: 'Basic intro to AI concepts',
            numNodes: 5,
            minAge: 12,
            maxAge: 18,
            learningPathId: 'lp-123',
            language: 'en',
            hruid: 'intro-ai',
            id: 'some-uuid-123'
        };


        service.retrieveOneLearningPath(onePathQuery).subscribe((response) => {
            expect(response).toEqual(onePathResponse);
        });

        const req = httpMock.expectOne(
            req => req.method === 'GET' &&
                req.url === `${service['API_URL']}/learningPath/intro-ai` &&
                req.urlWithParams.includes('language=en') &&
                req.urlWithParams.includes('includeNodes=true')
        );

        expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
        req.flush(onePathResponse);
    });

});

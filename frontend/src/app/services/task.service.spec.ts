import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TaskService } from './task.service';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { of } from 'rxjs';
import { Task, CreateTaskResponse, GetTasksResponse, TaskType } from '../interfaces/tasks';

describe('TaskService', () => {
    const task: Task = {
        assignmentId: 'assignment-id',
        step: 1,
        type: TaskType.NORMALQUESTION,
        question: 'Wat is de hoofdstad van België?',
        details: { predefined_answer: 'Brussel' },
    };

    const createdResponse: CreateTaskResponse = {
        id: 'task-id'
    };

    const getTasksResponse: GetTasksResponse = {
        tasks: ['task-id']
    };

    let http: jasmine.SpyObj<HttpClient>;
    let authService: jasmine.SpyObj<AuthenticationService>;
    let errorService: jasmine.SpyObj<ErrorService>;
    let service: TaskService;

    beforeEach(() => {
        http = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch', 'delete']);
        errorService = jasmine.createSpyObj('ErrorService', ['pipeHandler']);
        errorService.pipeHandler.and.callFake(() => (source) => source);
        authService = jasmine.createSpyObj('AuthenticationService', ['retrieveAuthenticationHeaders']);
        authService.retrieveAuthenticationHeaders.and.returnValue({
            headers: new HttpHeaders().append('Authorization', 'Bearer token').append('Content-Type', 'application/json'),
        });

        service = new TaskService(http, authService, errorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create a task', () => {
        http.post.and.returnValue(of(createdResponse));

        service.createTask(task).subscribe(result => {
            expect(result).toBe('task-id');
        });

    });

    it('should get one task by id', () => {
        http.get.and.returnValue(of(task));

        service.getOneTask('task-id').subscribe(result => {
            expect(result).toEqual(task);
        });

        expect(http.get).toHaveBeenCalledWith(
            jasmine.stringMatching(/\/tasks\/task-id$/),
            jasmine.any(Object)
        );
    });

    it('should retrieve a specific task from an assignment', () => {
        http.get.and.callFake((url: string) => {
            if (url.endsWith('/assignments/assignment-id/tasks?step=1')) {
                return of(getTasksResponse);
            }
            if (url.endsWith('/tasks/task-id')) {
                return of(task);
            }
            // voor de zekerheid
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return of(null as any);
        });

        service.getSpecificTaskOfAssignment('assignment-id', 1)
            .subscribe(result => {
                expect(result).toEqual(task);
            });

        expect(http.get).toHaveBeenCalledTimes(2);

        expect(http.get.calls.argsFor(0)[0])
            .toMatch(/assignments\/assignment-id\/tasks\?step=1$/);
        expect(http.get.calls.argsFor(1)[0])
            .toMatch(/tasks\/task-id$/);
    });

    it('should delete a task', () => {
        http.delete.and.returnValue(of());

        service.deleteTask('task-id').subscribe(result => {
            expect(result).toEqual();
        });

        expect(http.delete).toHaveBeenCalledWith(
            jasmine.stringMatching(/\/tasks\/task-id$/),
            jasmine.any(Object)
        );
    });

    it('should update a task', () => {
        http.patch.and.returnValue(of(createdResponse));

        service.updateTask('task-id', task).subscribe(result => {
            expect(result).toBe('task-id');
        });

        expect(http.patch).toHaveBeenCalledWith(
            jasmine.stringMatching(/\/tasks\/task-id$/),
            task,
            jasmine.any(Object)
        );
    });
});

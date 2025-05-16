import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { ErrorService } from './error.service';
import { switchMap, of, forkJoin, map } from 'rxjs';
import { CreateTaskResponse, GetTasksResponse, MultipleChoiceTask, NormalQuestionTask, Task, TaskType } from "../interfaces/tasks";
import { AssignmentTask, MultipleChoice, NormalQuestion } from "../interfaces/assignment/tasks";

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private API_URL = environment.API_URL;

    constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
        private errorService: ErrorService,
    ) { }

    /**
     * Function to convert a task to the NormalQuestion or MultipleChoice objects
     */
    public responseToObject(task: Task): AssignmentTask {
        if (task.type === TaskType.NORMALQUESTION) {
            const detailed = task.details as NormalQuestionTask
            return {
                question: task.question,
                answer: "",
                predefined_answer: detailed.predefined_answer,
                type: task.type,
            } as NormalQuestion
        }
        const detailed = task.details as MultipleChoiceTask
        return {
            question: task.question,
            type: task.type,
            options: detailed.options,
            correctAnswers: detailed.correctAnswers,
            allowMultipleAnswers: detailed.allowMultipleAnswers,
            selected: [],
        } as MultipleChoice
    }



    /**
     * Function to create a task (multiple choice or normal question) within an assignment step
     * 
     * @param task the Task to be created
     * @returns the ID of the newly created Task
     */
    createTask(task: Task) {
        const headers = this.authService.retrieveAuthenticationHeaders();
        return this.http.post<CreateTaskResponse>(
            `${this.API_URL}/tasks`,
            task,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(res => of(res.id))
        )
    }

    /**
     * Get one task based on the task ID
     * 
     * @param taskId 
     * @returns the task
     */
    getOneTask(taskId: string) {
        const headers = this.authService.retrieveAuthenticationHeaders();
        return this.http.get<Task>(
            `${this.API_URL}/tasks/${taskId}`,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
        )
    }

    /**
     * Function to retrieve all task ID's within an assignment
     * 
     * @param assignmentId 
     * @returns the list of task id's
     */
    getAllAssignmentTaskIds(assignmentId: string) {
        const headers = this.authService.retrieveAuthenticationHeaders();
        return this.http.get<GetTasksResponse>(
            `${this.API_URL}/assignments/${assignmentId}/tasks`,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(res => of(res.tasks))
        )
    }

    /**
     * Function to return every full task object within an assignment
     * 
     * @param assignmentId 
     * @returns every task
     */
    getAllAssignmentTasks(assignmentId: string) {
        const headers = this.authService.retrieveAuthenticationHeaders();
        return this.http.get<GetTasksResponse>(
            `${this.API_URL}/assignments/${assignmentId}/tasks`,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(response =>
                forkJoin(
                    response.tasks.map(id =>
                        this.http.get<Task>(
                            `${this.API_URL}/tasks/${id}`,
                            headers
                        )
                    )
                )
            )
        )
    }

    /**
     * Get the task of a specific step within an assignment
     * 
     * @param assignmentId 
     * @param step of the task you want
     */
    getSpecificTaskOfAssignment(assignmentId: string, step: number) {
        const headers = this.authService.retrieveAuthenticationHeaders();
        return this.http.get<GetTasksResponse>(
            `${this.API_URL}/assignments/${assignmentId}/tasks?step=${step}`,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
            switchMap(res =>
                this.http.get<Task>(
                    `${this.API_URL}/tasks/${res.tasks[0]}`,
                    headers
                )
            )
        )
    }

    /**
     * Delete the task with this task ID.
     * 
     * @param taskId 
     */
    deleteTask(taskId: string) {
        const headers = this.authService.retrieveAuthenticationHeaders();
        return this.http.delete<void>(
            `${this.API_URL}/tasks/${taskId}`,
            headers
        ).pipe(
            this.errorService.pipeHandler()
        )
    }

    /**
     * Update a task
     * 
     * @param taskId 
     * @param task the task object itself
     * @returns id, it might be altered
     */
    updateTask(taskId: string, task: Task) {
        const headers = this.authService.retrieveAuthenticationHeaders();
        return this.http.patch<CreateTaskResponse>(
            `${this.API_URL}/tasks/${taskId}`,
            task,
            headers
        ).pipe(
            this.errorService.pipeHandler(),
            map(res => res.id)
        )
    }
}
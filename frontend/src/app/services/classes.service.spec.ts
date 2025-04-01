import { Observable, of } from "rxjs";
import { Class } from "../interfaces/classes/class";
import { ClassesReponse, ClassesService, NewClassResponse } from "./classes.service";
import { HttpClient } from "@angular/common/http";

describe('ClassesService', () => {
    let http: jasmine.SpyObj<HttpClient>;
    let service: ClassesService;

    const id: string = "123";
    const name: string = "programming";
    const description: string = "programming for old people";
    const targetAudience: string = "old people";
    const teacherId: string = "321";

    const _class: Class = {
        id,
        name,
        description,
        targetAudience,
        teacherId
    };

    const _newClassResponse: NewClassResponse = {
        id: id
    };

    const _classesResponse: ClassesReponse = {
        classes: [id]
    }

    beforeEach(() => {
        http = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete', 'patch']);
        service = new ClassesService(http);
    });

    it('should respond with classes', () => {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        http.get.and.callFake((url: string): Observable<any> => {
            if(url.includes('/users')) {
                return of(_classesResponse);
            } else if(url.includes('/classes')) {
                return of(_class);
            }
            return of(null);
        });

        service.classesOfUser().subscribe((response: Class[]) => {
            expect(response).toEqual([_class]);
        });
    });

    it('should respond class with id', () => {
        http.get.and.returnValue(of(_class));

        service.classWithId('123').subscribe((response: Class) => {
            expect(response).toEqual(_class);
        });
    });

    it('should create a class', () => {
        http.post.and.returnValue(of(_newClassResponse));

        service.createClass(_class).subscribe((response: string) => {
            expect(response).toEqual(id);
        });
    });

    it('should delete a class', () => {
        http.delete.and.returnValue(of({status: 204}));

        service.deleteClass(id).subscribe((response: boolean) => {
            expect(response).toBeTrue();
        });
    });

    it('should update a class', () => {
        http.patch.and.returnValue(of({status: 204}));

        service.updateClass(_class).subscribe((response: boolean) => {
            expect(response).toBeTrue();
        });
    });

});

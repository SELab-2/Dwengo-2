import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ClassMembersListComponent } from "./class-members-list.component";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from "../../../environments/environment";
import { Class } from "../../interfaces/classes/class";

describe('ClassMembersListComponent', () => {
    let component: ClassMembersListComponent
    let fixture: ComponentFixture<ClassMembersListComponent>;
    let httpTesting: HttpTestingController;

    const testClass: Class = {
        name: "TestMath",
        description: "This is a test class",
        targetAudience: "Testers",
        teacherId: "123",
        id: "123"
    };
    const API_URL = environment.API_URL;

    beforeAll(async () => {
        await TestBed.configureTestingModule({
            imports: [ClassMembersListComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        })
        .compileComponents();

        // Inject mock HTTP client
        httpTesting = TestBed.inject(HttpTestingController);

        fixture = TestBed.createComponent(ClassMembersListComponent);
        component = fixture.componentInstance;
        component._class = testClass;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should make a request to the API', () => {
        // Check the made request
        const req = httpTesting.expectOne(`${API_URL}/classes/${testClass.id}/users`);
        expect(req.request.method).toBe('GET');
        expect(req.request.headers.has('Authorization')).toBeTrue();

        // Respond to the request
        req.flush({
            teachers: [],
            students: []
        });
    });

    it('should have a table', () => {
        const table = fixture.nativeElement.querySelector('table');
        expect(table).toBeTruthy();
    });

});

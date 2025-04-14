import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ClassPendingRequestsComponent } from "./class-pending-requests.component";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Class } from "../../interfaces/classes/class";
import { environment } from "../../../environments/environment";


describe('ClassPendingRequestsComponent', () => {
  let component: ClassPendingRequestsComponent;
  let fixture: ComponentFixture<ClassPendingRequestsComponent>;
  let httpTest: HttpTestingController;

  const testClass: Class = {
    name: "TestMath",
    description: "This is a test class",
    targetAudience: "Testers",
    teacherId: "123",
    id: "123"
  };
  const API_URL = environment.API_URL;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassPendingRequestsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    httpTest = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(ClassPendingRequestsComponent);
    component = fixture.componentInstance;
    component._class = testClass;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should make request to join requests of class', () => {
    // Make request to requests of a class
    const requestToClassRequests = httpTest.expectOne(`${API_URL}/classes/${testClass.id}/requests`);
    expect(requestToClassRequests.request.method).toBe('GET');

    const requesterId: string = "12345";
    requestToClassRequests.flush([
      {
        id: "requestId",
        requester: requesterId,
        classId: testClass.id,
        type: "student"
      }
    ]);
  });

  
});

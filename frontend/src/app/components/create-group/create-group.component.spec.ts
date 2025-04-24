import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CreateGroupComponent } from "./create-group.component";
import { GroupService } from "../../services/group.service";
import { User } from "../../interfaces";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from "@angular/router";


describe('CreateGroupComponent', () => {
    let component: CreateGroupComponent;
    let fixture: ComponentFixture<CreateGroupComponent>;
    const members: User[] = [
        { id: '1', firstName: 'Alice', familyName: 'Smith', email: 'alice@school.com', schoolName: 'School', passwordHash: 'pass1' },
        { id: '2', firstName: 'Bob', familyName: 'Brown', email: 'bob@school.com', schoolName: 'School', passwordHash: 'pass2' },
        { id: '3', firstName: 'Charlie', familyName: 'Jones', email: 'charlie@school.com', schoolName: 'School', passwordHash: 'pass3' }
    ];
    const assignmentId: string = "123";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreateGroupComponent],
            providers: [
                GroupService,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: () => assignmentId
                            }
                        }
                    }
                },
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        }).compileComponents();

        // Inject mock HTTP client
        TestBed.inject(HttpTestingController);

        fixture = TestBed.createComponent(CreateGroupComponent);
        component = fixture.componentInstance;

        // Mock data
        component.assignmentId = assignmentId;
        component.members = members;
        
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should contain a members list', () => {
        const membersList = fixture.nativeElement.querySelector('.members-list');
        expect(membersList).toBeTruthy();
    });

    it('should contain users in the members list', () => {
        const membersList = fixture.nativeElement.querySelectorAll('app-mini-user');
        expect(membersList.length).toBe(members.length);

        members.forEach((user, index) => {
            expect(membersList[index].textContent).toContain(user.firstName);
            expect(membersList[index].textContent).toContain(user.familyName);
        });
    });

    it('should have a create button', () => {
        const createButton = fixture.nativeElement.querySelector('button[id="create-group-button"]');
        expect(createButton).toBeTruthy();
    });

    it('should have a new group droplist', () => {
        const newGroupDroplist = fixture.nativeElement.querySelector('div[id="new-group"]');
        expect(newGroupDroplist).toBeTruthy();
    });

});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupCardComponent } from './group-card.component';
import { Group } from '../../interfaces/group/group';
import { provideRouter } from '@angular/router';

describe('GroupCardComponent', () => {
    let component: GroupCardComponent;
    let fixture: ComponentFixture<GroupCardComponent>;
    const group: Group = {
        id: '1234',
        assignment: {
            id: '321',
            classId: '123',
            startDate: new Date(),
            deadline: new Date(),
            extraInstructions: 'Extra instructions',
            learningPathId: '123',
            name: 'Constructing profile HMMs'
        },
        members: [{
            id: '123', email: 'alice@bob.com', firstName: 'Alice', familyName: 'Daubechies', schoolName: 'Carol University', passwordHash: '1234',
        }]
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GroupCardComponent],
            providers: [
            provideRouter([
                { path: 'student/groups/:id', component: GroupCardComponent }
            ]),
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(GroupCardComponent);
        component = fixture.componentInstance;

        component.group = group;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display information about the assignment', () => {
        const assignmentInfo = fixture.nativeElement.querySelector('mat-card-title[id=group-title]');
        expect(assignmentInfo).toBeTruthy();
        expect(assignmentInfo.textContent).toContain(group.assignment.name);
    });

    it('should display information about the group', () => {
        const groupInfo = fixture.nativeElement.querySelector('mat-card-content[id=group-info]');
        expect(groupInfo).toBeTruthy();
        expect(groupInfo.textContent).toContain(group.members.length.toString());
    });

});

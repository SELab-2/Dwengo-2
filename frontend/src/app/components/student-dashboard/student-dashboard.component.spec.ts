import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StudentDashboardComponent } from './student-dashboard.component';
import { PaginatedGridComponent } from '../paginated-grid/paginated-grid.component';
import { of } from 'rxjs';
import { AssignmentService } from '../../services/assignment.service';
import { ClassesService } from '../../services/classes.service';
import { MockServices } from '../teacher-dashboard/mock-services';
import { provideRouter } from '@angular/router';
import { Component, Input } from '@angular/core';
import { Assignment } from '../../interfaces/assignment/assignment';
import { Class } from '../../interfaces/classes/class';
import { By } from '@angular/platform-browser';
import { GroupService } from '../../services/group.service';
import { AuthenticationService } from '../../services/authentication.service';

//stubs for child components
@Component({ selector: 'app-mini-assignment', template: '' })
class MockMiniAssignmentComponent {
  @Input() _assignment!: Assignment;
}

@Component({ selector: 'app-mini-class', template: '' })
class MockMiniClassComponent {
  @Input() _class!: Class;
  @Input() _type!: string;
}

// mock services
class MockClassesService {
    classesOfUser = () => of(MockServices.getClasses());
    classWithId = (id: string) => of(MockServices.getClasses().find(cls => cls.id === id));
}
  
class MockAssignmentService {
    retrieveAssignments = () => of(MockServices.getAssignments());
}

class MockGroupService {
  getAllGroupsFromUser = () => of(MockServices.getGroups());
}

class MockAuthenticationService {
  retrieveUserId = () => of('123');
}

describe('StudentDashboardComponent', () => {
    let fixture: ComponentFixture<StudentDashboardComponent>;
    let component: StudentDashboardComponent;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
            StudentDashboardComponent,
            MockMiniAssignmentComponent,
            MockMiniClassComponent,
            PaginatedGridComponent,
        ],
        providers: [
          provideRouter([]),
          { provide: ClassesService, useClass: MockClassesService },
          { provide: AssignmentService, useClass: MockAssignmentService },
          { provide: GroupService, useClass: MockGroupService },
          { provide: AuthenticationService, useClass: MockAuthenticationService },
        ],
      }).compileComponents();
  
      fixture = TestBed.createComponent(StudentDashboardComponent);
      component = fixture.componentInstance;
  
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'dashboardPageSize') return '6';
        if (key === 'dashboardPageIndex') return '1';
        return null;
      });
      spyOn(localStorage, 'setItem');
      await fixture.whenStable();
      fixture.detectChanges(); // triggers ngOnInit
    });
  
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
  
    it('should load classes and assignments on init', fakeAsync(() => {
      tick(); // simulate async operations
      expect(component.classes.length).toBe(MockServices.getClasses().length);
      expect(component.assignments.length).toBe(MockServices.getAssignments().length);
    }));
  
    it('should set pageSize and currentPageIndex from localStorage', () => {
      expect(component.pageSize).toBe(6);
      expect(component.currentPageIndex).toBe(1);
    });
  
    it('should slice assignments for the current page', () => {
        const allAssignments = MockServices.getAssignments();
        const allClasses = MockServices.getClasses();
      
        const enrichedAssignments = allAssignments.map(a => ({
          ...a,
          className: allClasses.find(c => c.id === a.classId)?.name
        }));
      
        // simulate going to page 2 (index 1)
        component.onPageChange({ pageIndex: 1, pageSize: 6, length: enrichedAssignments.length });
        fixture.detectChanges();
      
        const expected = enrichedAssignments.slice(6, 12); // second page
        expect(component.pagedAssignments).toEqual(expected);
    });
  
    it('should update paged assignments when page changes', () => {
      component.onPageChange({ pageIndex: 0, pageSize: 3, length: 9 });
      expect(localStorage.setItem).toHaveBeenCalledWith('dashboardPageSize', '3');
      expect(localStorage.setItem).toHaveBeenCalledWith('dashboardPageIndex', '0');
      expect(component.pagedAssignments.length).toBe(3);
      expect(component.pagedAssignments[0].id).toBe('1');
    });
  
    it('should pass assignments and classes to paginated-grid components', () => {
        component.pageSize = 12;
        component.currentPageIndex = 0;
        component.updatePagedAssignments();
        fixture.detectChanges();    // update DOM after async
      
        const grids = fixture.debugElement.queryAll(By.directive(PaginatedGridComponent));
        expect(grids.length).toBe(3);
      
        const [assignmentsGrid, classesGrid] = grids.map(grid => grid.componentInstance);
      
        expect(assignmentsGrid.items.length).toBeGreaterThan(0);
        expect(classesGrid.items.length).toBeGreaterThan(0);
        expect(classesGrid.showPagination).toBeFalse();
        expect(assignmentsGrid.pageSize).toBe(12);
    });
  
    it('should set className for each assignment based on classId', fakeAsync(() => {
      tick(); // wait for subscriptions
      for (const assignment of component.assignments) {
        const cls = MockServices.getClasses().find(c => c.id === assignment.classId);
        expect(assignment.className).toBe(cls?.name ?? 'Unknown Class');
      }
    }));
});
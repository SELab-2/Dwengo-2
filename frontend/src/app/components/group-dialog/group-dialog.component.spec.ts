import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupDialogComponent } from './group-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

describe('GroupDialogComponent', () => {
  let component: GroupDialogComponent;
  let fixture: ComponentFixture<GroupDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<GroupDialogComponent>>;

  const mockDataWithMembers = {
    members: [
      { id: 1, firstName: 'Alice', familyName: 'test', email: "test@test.com", schoolName: "test" },
      { id: 2, name: 'Bob', familyName: 'test', email: "test@test.com", schoolName: "test" }
    ]
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        MatExpansionModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDataWithMembers },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct members count', () => {
    component.data = mockDataWithMembers
    fixture.detectChanges()
    const title = fixture.debugElement.query(By.css('.title')).nativeElement;
    expect(title.textContent).toContain('Members: 2');
  });

  it('should render mini-user components for each member', () => {
    component.data = mockDataWithMembers
    fixture.detectChanges()
    const miniUsers = fixture.debugElement.queryAll(By.css('app-mini-user'));
    expect(miniUsers.length).toBe(2);
  });

  it('should close dialog when exit button is clicked', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should show "There are no users in this group" if no members', () => {
    // Update data to no members
    component.data.members = null;
    fixture.detectChanges();

    const noUsersMessage = fixture.debugElement.query(By.css('h3'));
    expect(noUsersMessage.nativeElement.textContent.trim()).toBe('No members');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniUserComponent } from './mini-user.component';
import { User } from '../../interfaces';

describe('MiniUserComponent', () => {
  let component: MiniUserComponent;
  let fixture: ComponentFixture<MiniUserComponent>;

  const user: User = {
    id: '123',
    email: 'test@mail.com',
    firstName: 'John',
    familyName: 'Doe',
    schoolName: 'Test School',
    passwordHash: 'hashedpassword'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniUserComponent);
    component = fixture.componentInstance;

    component.user = user;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the user his name', () => {
    const name = fixture.debugElement.nativeElement.querySelector('#user-name');
    expect(name).toBeDefined();
    expect(name.textContent).toContain(user.firstName);
    expect(name.textContent).toContain(user.familyName);
  });

  it('should have the user his email and school', () => {
    const mail = fixture.debugElement.nativeElement.querySelector('#mail');
    const school = fixture.debugElement.nativeElement.querySelector('#school');
    expect(mail).toBeDefined();
    expect(school).toBeDefined();
    expect(mail.textContent).toContain(user.email);
    expect(school.textContent).toContain(user.schoolName);
  });

});

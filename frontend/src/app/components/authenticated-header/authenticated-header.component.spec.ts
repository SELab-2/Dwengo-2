import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthenticatedHeaderComponent } from './authenticated-header.component';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthenticationService } from '../../services/authentication.service';

describe('AuthenticatedHeaderComponent', () => {
  let component: AuthenticatedHeaderComponent;
  let harness: RouterTestingHarness;
  
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AuthenticatedHeaderComponent],
      providers: [
        provideRouter([{ path: '**', component: AuthenticatedHeaderComponent }]),
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthenticationService,
      ]
    }).compileComponents();

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', AuthenticatedHeaderComponent);
    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the dwengo logo', () => {
    const logo = harness.fixture.nativeElement.querySelector('img');
    expect(logo).toBeTruthy();
  });

  it('should have a home button', () => {
    const homeButton = harness.fixture.debugElement.query(By.css('.home-button'));
    expect(homeButton).toBeTruthy();
  });

  it('should have a menu', () => {
    const menu = harness.fixture.nativeElement.querySelector('app-authenticated-menu');
    expect(menu).toBeTruthy();
  })

  it('should have a logout button', () => {
    const logoutButton = harness.fixture.debugElement.query(By.css('.logout-button'));
    expect(logoutButton).toBeTruthy();
  });
});

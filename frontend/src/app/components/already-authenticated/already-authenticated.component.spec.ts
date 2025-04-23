import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AlreadyAuthenticatedComponent } from './already-authenticated.component';

import { AuthenticationService } from '../../services/authentication.service';

describe('AlreadyAuthenticatedComponent', () => {
  let component: AlreadyAuthenticatedComponent;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AlreadyAuthenticatedComponent],
      providers: [
        provideRouter([{ path: '**', component: AlreadyAuthenticatedComponent }]),
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthenticationService,
      ]
    })

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', AlreadyAuthenticatedComponent);
    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title', () => {
    const title = harness.fixture.nativeElement.querySelector('h1');
    expect(title).toBeTruthy();
  });

  it('should have a message', () => {
    const message = harness.fixture.nativeElement.querySelector('p');
    expect(message).toBeTruthy();
  });

  it('should have a button to return to login', () => {
    const button = harness.fixture.nativeElement.querySelector('button[name="home-button"]');
    expect(button).toBeTruthy();
  });

  it('should have a button to return to the dashboard if authenticated', () => {
    const button = harness.fixture.nativeElement.querySelector('button[name="dashboard-button"]');
    expect(button).toBeTruthy();
  });
});

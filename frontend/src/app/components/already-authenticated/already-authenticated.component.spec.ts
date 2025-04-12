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
});

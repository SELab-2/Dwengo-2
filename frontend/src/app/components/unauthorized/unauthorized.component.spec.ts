import { TestBed } from '@angular/core/testing';
import { UnauthorizedComponent } from './unauthorized.component';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

describe('UnauthorizedComponent', () => {
  let component: UnauthorizedComponent;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [UnauthorizedComponent],
      providers: [
        provideRouter([{ path: '**', component: UnauthorizedComponent }]),
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthenticationService,
      ]
    });

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', UnauthorizedComponent);
    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

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

  it('should have the logo', () => {
    const logo = harness.fixture.nativeElement.querySelector('img');
    expect(logo).toBeTruthy();
  });

  it('should have a title', () => {
    const title = harness.fixture.nativeElement.querySelector('h1');
    expect(title).toBeTruthy();
  });

  it('should have a message', () => {
    const message = harness.fixture.nativeElement.querySelector('p');
    expect(message).toBeTruthy();
  });

  it('should have a button', () => {
    const button = harness.fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
  });
});

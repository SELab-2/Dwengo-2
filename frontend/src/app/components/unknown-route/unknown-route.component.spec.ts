import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { UnknownRouteComponent } from './unknown-route.component';
import { provideRouter } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';

describe('UnknownRouteComponent', () => {
  let component: UnknownRouteComponent;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [UnknownRouteComponent],
      providers: [
        provideRouter([{ path: '**', component: UnknownRouteComponent }]),
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthenticationService,
      ]
    });

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', UnknownRouteComponent);
    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the logo', () => {
    const logo = harness.fixture.nativeElement.querySelector('img');
    expect(logo).toBeTruthy();
  });

  it('should have the header', () => {
    const header = harness.fixture.nativeElement.querySelector('h1');
    expect(header).toBeTruthy();
  });

  it('should have the text', () => {
    const text = harness.fixture.nativeElement.querySelector('p');
    expect(text).toBeTruthy();
  });

  it('should have the button', () => {
    const button = harness.fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
  });
});

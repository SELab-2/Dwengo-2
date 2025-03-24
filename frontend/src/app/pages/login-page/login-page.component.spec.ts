import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from "@angular/router/testing";
import { LoginPageComponent } from "./login-page.component"

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        provideRouter([{ path: "**", component: LoginPageComponent }])
      ]
    });

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', LoginPageComponent);
    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the unauthenticated header', () => {
    const header = harness.fixture.nativeElement.querySelector('app-unauthenticated-header');
    expect(header).toBeTruthy();
  });

  it('should contain the login form', () => {
    const form = harness.fixture.nativeElement.querySelector('app-login');
    expect(form).toBeTruthy();
  });
});

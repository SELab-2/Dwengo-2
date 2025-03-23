import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { RouterTestingHarness } from "@angular/router/testing";
import { RegisterComponent } from "./register.component";
import { By } from "@angular/platform-browser";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([{ path: "**", component: RegisterComponent }])
      ]
    });

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', RegisterComponent);
    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a register form', () => {
    const registerForm = harness.fixture.nativeElement.querySelector('form');
    expect(registerForm).toBeTruthy();
  });

  it('should have an email input', () => {
    const emailInput = harness.fixture.nativeElement.querySelector('input[type="email"]');
    expect(emailInput).toBeTruthy();
  });

  it('should have a password input', () => {
    const passwordInput = harness.fixture.debugElement.query(By.css('input[name="password"]'));
    expect(passwordInput).toBeTruthy();
  });

  it('should have a confirm password input', () => {
    const confirmPasswordInput = harness.fixture.debugElement.query(By.css('input[name="confirm-password"]'));
    expect(confirmPasswordInput).toBeTruthy();
  });

  it('should have a register button', () => {
    const registerButton = harness.fixture.nativeElement.querySelector('button');
    expect(registerButton).toBeTruthy();
  });
});

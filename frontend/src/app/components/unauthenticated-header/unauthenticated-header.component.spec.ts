import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from "@angular/router/testing";
import { UnauthenticatedHeaderComponent } from "./unauthenticated-header.component"

describe('UnauthenticatedHeaderComponent', () => {
  let component: UnauthenticatedHeaderComponent;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [UnauthenticatedHeaderComponent],
      providers: [
        provideRouter([{ path: "**", component: UnauthenticatedHeaderComponent }])
      ]
    });

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', UnauthenticatedHeaderComponent);
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

  it('should have a register button if not on register route', async () => {
    await harness.navigateByUrl('/not-register');
    harness.detectChanges();

    const registerButton = harness.fixture.debugElement.query(By.css('.register-button'));
    expect(registerButton).toBeTruthy();
  });

  it('should not have a register button if on register page', async () => {
    await harness.navigateByUrl('/register');
    harness.detectChanges();

    const registerButton = harness.fixture.debugElement.query(By.css('.register-button'));
    expect(registerButton).toBeFalsy();
  });
});

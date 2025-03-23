import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from "@angular/router/testing";
import { RegisterPageComponent } from "./register-page.component"

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [RegisterPageComponent],
      providers: [
        provideRouter([{ path: "**", component: RegisterPageComponent }])
      ]
    });

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', RegisterPageComponent);
    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the unauthenticated header', () => {
    const header = harness.fixture.nativeElement.querySelector('app-unauthenticated-header');
    expect(header).toBeTruthy();
  });

  it('should contain the register form', () => {
    const form = harness.fixture.nativeElement.querySelector('app-register');
    expect(form).toBeTruthy();
  });
});

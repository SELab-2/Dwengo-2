import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { RouterTestingHarness } from "@angular/router/testing";
import { LoginComponent } from "./login.component";

describe('LoginComponent', () => {
    let component: LoginComponent;
    let harness: RouterTestingHarness;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [
                provideRouter([{ path: "**", component: LoginComponent }])
            ]
        });

        harness = await RouterTestingHarness.create();
        component = await harness.navigateByUrl('/', LoginComponent);
        harness.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a login form', () => {
        const loginForm = harness.fixture.nativeElement.querySelector('form');
        expect(loginForm).toBeTruthy();
    });

    it('should have an email input', () => {
        const emailInput = harness.fixture.nativeElement.querySelector('input[type="email"]');
        expect(emailInput).toBeTruthy();
    });

    it('should have a password input', () => {
        const passwordInput = harness.fixture.nativeElement.querySelector('input[type="password"]');
        expect(passwordInput).toBeTruthy();
    });
});

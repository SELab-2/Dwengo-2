import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { RouterTestingHarness } from "@angular/router/testing";
import { LandingPageComponent } from "./landing-page.component";

describe('LandingPageComponent', () => {
	let component: LandingPageComponent;
	let harness: RouterTestingHarness;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [LandingPageComponent],
			providers: [
				provideRouter([{ path: "**", component: LandingPageComponent }])
			]
		});

		harness = await RouterTestingHarness.create();
		component = await harness.navigateByUrl('/', LandingPageComponent);
		harness.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should contain the dwengo logo', () => {
		const logo = harness.fixture.nativeElement.querySelector('img');
		expect(logo).toBeTruthy();
	});

	it('should contain the teacher login button', () => {
		const loginButton = harness.fixture.nativeElement.querySelector('button[name="teacher-login-button"]');
		expect(loginButton).toBeTruthy();
	});

	it('should contain the student login button', () => {
		const loginButton = harness.fixture.nativeElement.querySelector('button[name="student-login-button"]');
		expect(loginButton).toBeTruthy();
	});

	it('should contain the register button', () => {
		const registerButton = harness.fixture.nativeElement.querySelector('button[name="register-button"]');
		expect(registerButton).toBeTruthy();
	});
});

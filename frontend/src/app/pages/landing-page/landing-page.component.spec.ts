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
});

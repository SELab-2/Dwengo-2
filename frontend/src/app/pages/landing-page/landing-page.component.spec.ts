import { TestBed } from '@angular/core/testing';
import { LandingPageComponent } from './landing-page.component';
import { provideRouter, RouterLinkWithHref } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('LandingPageComponent', () => {

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
						LandingPageComponent,
						RouterTestingModule
					],

			// Mock the router
			providers: [
				provideRouter([])
			]
		}).compileComponents();
	});

	it('should create the component', () => {
		const fixture = TestBed.createComponent(LandingPageComponent);
		const component = fixture.componentInstance;

		expect(component).toBeTruthy();
	});

	it('should have a description', () => {
		const fixture = TestBed.createComponent(LandingPageComponent);
		const compiled = fixture.nativeElement as HTMLElement;

		const h2 = compiled.querySelector('h2')!;

		expect(h2).toBeTruthy();
	});

	it('should have a login and register link', () => {
		const fixture = TestBed.createComponent(LandingPageComponent);

		const anchors = fixture.debugElement.queryAll(By.css('a'));
		const routerLinkInstances = anchors.map((anchor) => anchor.injector.get(RouterLinkWithHref));

		expect(routerLinkInstances.length).toBe(2);
		expect(routerLinkInstances[0]['commands']).toEqual(['/login']);
		expect(routerLinkInstances[1]['commands']).toEqual(['/register']);
	});

});

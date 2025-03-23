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
});

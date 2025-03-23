import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { RouterTestingHarness } from "@angular/router/testing";
import { AppComponent } from "./app.component";

describe('AppComponent', () => {
    let component: AppComponent;
    let harness: RouterTestingHarness;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                provideRouter([{ path: "**", component: AppComponent }])
            ]
        });

        harness = await RouterTestingHarness.create();
        component = await harness.navigateByUrl('/', AppComponent);
        harness.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

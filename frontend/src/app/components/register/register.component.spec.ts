import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { RouterTestingHarness } from "@angular/router/testing";
import { RegisterComponent } from "./register.component";

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
});

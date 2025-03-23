import { TestBed } from '@angular/core/testing';
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
});

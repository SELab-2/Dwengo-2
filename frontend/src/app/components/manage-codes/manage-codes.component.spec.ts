import { TestBed } from '@angular/core/testing';
import { ManageCodesComponent } from './manage-codes.component';
import { provideRouter } from '@angular/router';
import { ClassCodeService } from '../../services/class-codes.service';
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { Code } from '../../interfaces/codes/code';

describe('ManageCodesComponent', () => {
  let component: ManageCodesComponent;
  let harness: RouterTestingHarness;

  const testClassCode: Code = {
      classId: "12345",
      createdAt: new Date(),
      code: "ABC123",
      expired: false
    };
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCodesComponent],
      providers: [
        provideRouter([
            {path: 'teacher/classes/:id', component: ManageCodesComponent}
        ]),
        ClassCodeService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    // Inject mock HTTP client
    TestBed.inject(HttpTestingController);

    // Create testing harness
    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/teacher/classes/123', ManageCodesComponent);

    component.codes = [testClassCode];
    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a button to create new class codes', () => {
    const button = harness.fixture.nativeElement.querySelector('button[id=class-code-create-button]');
    expect(button).toBeTruthy();
  });

  it('should contain information about a class code', () => {
    const code = harness.fixture.nativeElement.querySelector('p[id=class-code]');
    expect(code).toBeTruthy();
    expect(code.innerText).toContain(testClassCode.code);

    const expired = harness.fixture.nativeElement.querySelector('p[id=is-expired]');
    expect(expired).toBeTruthy();
    expect(expired.innerText).toContain(testClassCode.expired ? 'Expired' : 'Active');
  });

  it('should have a button to display actions for a class code', () => {
    const button = harness.fixture.nativeElement.querySelector('button[id=class-code-menu-button]');
    expect(button).toBeTruthy();
  });

});

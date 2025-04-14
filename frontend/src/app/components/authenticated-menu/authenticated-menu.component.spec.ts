import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { AuthenticatedMenuComponent } from './authenticated-menu.component';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';
import { MatMenuHarness } from '@angular/material/menu/testing';

describe('AuthenticatedMenuComponent', () => {
  let component: AuthenticatedMenuComponent;
  let harness: RouterTestingHarness;

  let loader;
  let menuHarness: MatMenuHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AuthenticatedMenuComponent],
      providers: [
        provideRouter([{ path: '**', component: AuthenticatedMenuComponent }]),
      ],
    });
    
    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', AuthenticatedMenuComponent);
    harness.detectChanges();

    loader = TestbedHarnessEnvironment.loader(harness.fixture);
    menuHarness = await loader.getHarness(MatMenuHarness);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the menu button', () => {
    const button = harness.fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('should have a menu', () => {
    const menu = harness.fixture.nativeElement.querySelector('mat-menu');
    expect(menu).toBeTruthy();
  });

  it('should have the correct menu items for students', async () => {
    component.isStudent = true;
    
    await menuHarness.open();

    const items = await menuHarness.getItems();
    const texts = await Promise.all(items.map(i => i.getText()));

    expect(texts).toContain('Dashboard');
    expect(texts).toContain('Assignments');
    expect(texts).toContain('Classes');
  });

  it('should have the correct menu items for teachers', async () => {
    component.isStudent = false;

    await menuHarness.open();

    const items = await menuHarness.getItems();
    const texts = await Promise.all(items.map(i => i.getText()));

    expect(texts).toContain('Dashboard');
    expect(texts).toContain('Assignments');
    expect(texts).toContain('Classes');
  });
});

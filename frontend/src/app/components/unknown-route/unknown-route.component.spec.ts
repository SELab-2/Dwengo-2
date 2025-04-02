import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnknownRouteComponent } from './unknown-route.component';
import { provideRouter } from '@angular/router';

describe('UnknownRouteComponent', () => {
  let component: UnknownRouteComponent;
  let fixture: ComponentFixture<UnknownRouteComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [UnknownRouteComponent],
      providers: [
        provideRouter([{ path: '**', component: UnknownRouteComponent }]),
      ]
    });

    fixture = TestBed.createComponent(UnknownRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the logo', () => {
    const logo = fixture.nativeElement.querySelector('img');
    expect(logo).toBeTruthy();
  });

  it('should have the header', () => {
    const header = fixture.nativeElement.querySelector('h1');
    expect(header).toBeTruthy();
  });

  it('should have the text', () => {
    const text = fixture.nativeElement.querySelector('p');
    expect(text).toBeTruthy();
  });

  it('should have the button', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
  });
});

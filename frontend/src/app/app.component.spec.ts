import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';

describe('AppComponent', () => {

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AppComponent
            ],
            
            // Mock the router
            providers: [
				provideRouter([])
			]
        }).compileComponents();
    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;

        expect(app).toBeTruthy();
    });

});

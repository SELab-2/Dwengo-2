import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuCardComponent } from './menu-card.component';
import { By } from '@angular/platform-browser';

describe('MenuCardComponent', () => {
    let fixture: ComponentFixture<MenuCardComponent>;
    let component: MenuCardComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MenuCardComponent], // Import the standalone component
        }).compileComponents();

        fixture = TestBed.createComponent(MenuCardComponent);
        component = fixture.componentInstance;

        // Provide mock inputs to the component
        component.title = 'Test Title';
        component.count = 42;
        component.icon = 'test_icon';
        component.selected = true;
        component.color = 'red';

        // Trigger change detection
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should display the correct title', () => {
        const titleElement = fixture.debugElement.query(By.css('.menu-card .card-inner p'));
        expect(titleElement.nativeElement.textContent.trim()).toBe('Test Title');
    });

    it('should display the correct count', () => {
        const countElement = fixture.debugElement.query(By.css('.menu-card span'));
        expect(countElement.nativeElement.textContent.trim()).toBe('42');
    });

    it('should display the correct icon', () => {
        const iconElement = fixture.debugElement.query(By.css('mat-icon'));
        expect(iconElement.nativeElement.textContent.trim()).toBe('test_icon');
    });

    it('should apply the correct color class', () => {
        const cardElement = fixture.debugElement.query(By.css('.menu-card'));
        expect(cardElement.nativeElement.classList).toContain('red');
    });

    it('should emit an event when clicked', () => {
        spyOn(component.cardClick, 'emit');

        const cardElement = fixture.debugElement.query(By.css('.menu-card'));
        cardElement.nativeElement.click();

        expect(component.cardClick.emit).toHaveBeenCalled();
    });

    it('should use the default color if no color is provided', () => {
        component.color = '';
        fixture.detectChanges();

        const cardElement = fixture.debugElement.query(By.css('.menu-card'));
        expect(cardElement.nativeElement.classList).toContain('blue'); // Default color
    });
});
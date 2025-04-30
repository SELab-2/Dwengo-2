import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExplorePageComponent } from './explore-page.component';
import { AuthenticatedHeaderComponent } from '../../components/authenticated-header/authenticated-header.component';
import { ExploreComponent } from '../../components/explore/explore.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('ExplorePageComponent', () => {
    let fixture: ComponentFixture<ExplorePageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AuthenticatedHeaderComponent, ExploreComponent, HttpClientModule, ExplorePageComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { queryParams: {} } }
                }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExplorePageComponent);
        fixture.detectChanges();
    });

    it('should render app-authenticated-header', () => {
        const headerElement = fixture.nativeElement.querySelector('app-authenticated-header');
        expect(headerElement).toBeTruthy(); // Check if the header component is rendered
    });

    it('should render app-explore', () => {
        const exploreElement = fixture.nativeElement.querySelector('app-explore');
        expect(exploreElement).toBeTruthy(); // Check if the explore component is rendered
    });
});

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GroupComponent } from './group.component';
import { RouterTestingHarness } from '@angular/router/testing';
import { environment } from '../../../environments/environment';
import { GroupService } from '../../services/group.service';
import { provideRouter } from '@angular/router';

describe('GroupComponent', () => {
    let component: GroupComponent;
    let harness: RouterTestingHarness;
    let httpTesting: HttpTestingController;
    const API_URL: string = environment.API_URL;
    const groupId: string = '123';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GroupComponent],
            providers: [
                provideRouter([
                    { path: 'student/groups/:id', component: GroupComponent }
                ]),
                GroupService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        })
        .compileComponents();

        // Inject mock HTTP client
        httpTesting = TestBed.inject(HttpTestingController);

        // Create testing harness
        harness = await RouterTestingHarness.create();
        component = await harness.navigateByUrl(`student/groups/${groupId}`, GroupComponent);

        harness.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should make a request to the API', async () => {
        // Check the made request
        const req = httpTesting.expectOne(`${API_URL}/groups/${groupId}`);
        expect(req.request.method).toBe('GET');
        expect(req.request.headers.has('Authorization')).toBeTrue();
    });
});

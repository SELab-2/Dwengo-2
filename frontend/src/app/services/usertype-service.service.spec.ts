import { TestBed } from '@angular/core/testing';

import { UsertypeServiceService } from './usertype-service.service';

describe('UsertypeServiceService', () => {
  let service: UsertypeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsertypeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

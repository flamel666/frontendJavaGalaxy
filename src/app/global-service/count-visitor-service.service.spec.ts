import { TestBed } from '@angular/core/testing';

import { CountVisitorServiceService } from './count-visitor-service.service';

describe('CountVisitorServiceService', () => {
  let service: CountVisitorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountVisitorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

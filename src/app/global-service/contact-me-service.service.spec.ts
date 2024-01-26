import { TestBed } from '@angular/core/testing';

import { ContactMeServiceService } from './contact-me-service.service';

describe('ContactMeServiceService', () => {
  let service: ContactMeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactMeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

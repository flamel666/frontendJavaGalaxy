import { TestBed } from '@angular/core/testing';

import { ServiceConfigurationService } from './service-configuration.service';

describe('ServiceConfigurationService', () => {
  let service: ServiceConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { UrlPathService } from './url-path.service';

describe('UrlPathService', () => {
  let service: UrlPathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlPathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

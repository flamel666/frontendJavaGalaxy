import { TestBed } from '@angular/core/testing';

import { ConfigLanguageService } from './config-language.service';

describe('ConfigLanguageService', () => {
  let service: ConfigLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

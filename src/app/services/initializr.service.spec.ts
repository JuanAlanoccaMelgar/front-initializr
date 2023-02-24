import { TestBed } from '@angular/core/testing';

import { InitializrService } from './initializr.service';

describe('InitializrService', () => {
  let service: InitializrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitializrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

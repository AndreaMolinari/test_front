import { TestBed } from '@angular/core/testing';

import { IndirizzoService } from './indirizzo.service';

describe('IndirizzoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndirizzoService = TestBed.get(IndirizzoService);
    expect(service).toBeTruthy();
  });
});

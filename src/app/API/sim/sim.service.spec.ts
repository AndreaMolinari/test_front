import { TestBed } from '@angular/core/testing';

import { SimService } from './sim.service';

describe('SimService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimService = TestBed.get(SimService);
    expect(service).toBeTruthy();
  });
});

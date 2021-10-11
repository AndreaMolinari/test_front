import { TestBed } from '@angular/core/testing';

import { MezzoService } from './mezzo.service';

describe('MezzoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MezzoService = TestBed.get(MezzoService);
    expect(service).toBeTruthy();
  });
});

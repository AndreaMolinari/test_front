import { TestBed } from '@angular/core/testing';

import { TachoService } from './tacho.service';

describe('TachoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TachoService = TestBed.get(TachoService);
    expect(service).toBeTruthy();
  });
});

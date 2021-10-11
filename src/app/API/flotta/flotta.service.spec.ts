import { TestBed } from '@angular/core/testing';

import { FlottaService } from './flotta.service';

describe('FlottaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlottaService = TestBed.get(FlottaService);
    expect(service).toBeTruthy();
  });
});

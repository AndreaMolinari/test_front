import { TestBed } from '@angular/core/testing';

import { TipologiaService } from './tipologia.service';

describe('TipologiaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipologiaService = TestBed.get(TipologiaService);
    expect(service).toBeTruthy();
  });
});

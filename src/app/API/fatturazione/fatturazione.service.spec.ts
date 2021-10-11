import { TestBed } from '@angular/core/testing';

import { FatturazioneService } from './fatturazione.service';

describe('FatturazioneService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FatturazioneService = TestBed.get(FatturazioneService);
    expect(service).toBeTruthy();
  });
});

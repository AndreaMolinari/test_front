import { TestBed } from '@angular/core/testing';

import { RadiocomandoService } from './radiocomando.service';

describe('RadiocomandoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RadiocomandoService = TestBed.get(RadiocomandoService);
    expect(service).toBeTruthy();
  });
});

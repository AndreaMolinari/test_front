import { TestBed } from '@angular/core/testing';

import { ContattoService } from './contatto.service';

describe('ContattoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContattoService = TestBed.get(ContattoService);
    expect(service).toBeTruthy();
  });
});

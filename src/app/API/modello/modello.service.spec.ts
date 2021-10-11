import { TestBed } from '@angular/core/testing';

import { ModelloService } from './modello.service';

describe('ModelloService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModelloService = TestBed.get(ModelloService);
    expect(service).toBeTruthy();
  });
});

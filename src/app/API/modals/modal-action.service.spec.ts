import { TestBed } from '@angular/core/testing';

import { ModalActionService } from './modal-action.service';

describe('ModalActionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModalActionService = TestBed.get(ModalActionService);
    expect(service).toBeTruthy();
  });
});

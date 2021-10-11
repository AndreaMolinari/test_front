import { TestBed } from '@angular/core/testing';

import { EventiService } from './eventi.service';

describe('EventiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventiService = TestBed.get(EventiService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { CwStateService } from './cw-state.service';

describe('CwStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CwStateService = TestBed.get(CwStateService);
    expect(service).toBeTruthy();
  });
});

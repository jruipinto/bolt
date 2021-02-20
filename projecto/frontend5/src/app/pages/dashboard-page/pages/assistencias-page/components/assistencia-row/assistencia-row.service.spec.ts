import { TestBed } from '@angular/core/testing';

import { AssistenciaRowService } from './assistencia-row.service';

describe('AssistenciaRowService', () => {
  let service: AssistenciaRowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssistenciaRowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

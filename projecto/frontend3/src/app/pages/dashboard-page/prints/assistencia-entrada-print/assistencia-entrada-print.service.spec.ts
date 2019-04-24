import { TestBed } from '@angular/core/testing';

import { AssistenciaEntradaPrintService } from './assistencia-entrada-print.service';

describe('AssistenciaEntradaPrintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssistenciaEntradaPrintService = TestBed.get(AssistenciaEntradaPrintService);
    expect(service).toBeTruthy();
  });
});

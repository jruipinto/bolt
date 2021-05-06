import { TestBed } from '@angular/core/testing';

import { AssistenciaPageService } from './assistencia-page.service';

describe('AssistenciaPageService', () => {
  let service: AssistenciaPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssistenciaPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

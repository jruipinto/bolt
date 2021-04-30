import { TestBed } from '@angular/core/testing';

import { PageUiService } from './page-ui.service';

describe('PageUiService', () => {
  let service: PageUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

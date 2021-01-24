import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncomendaPromptModalComponent } from './encomenda-prompt-modal.component';

describe('EncomendaPromptModalComponent', () => {
  let component: EncomendaPromptModalComponent;
  let fixture: ComponentFixture<EncomendaPromptModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncomendaPromptModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncomendaPromptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

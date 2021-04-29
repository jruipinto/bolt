import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncomendaWizardComponent } from './encomenda-wizard.component';

describe('EncomendaWizardComponent', () => {
  let component: EncomendaWizardComponent;
  let fixture: ComponentFixture<EncomendaWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncomendaWizardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncomendaWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

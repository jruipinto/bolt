import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrcamentosSectionComponent } from './orcamentos-section.component';

describe('OrcamentosSectionComponent', () => {
  let component: OrcamentosSectionComponent;
  let fixture: ComponentFixture<OrcamentosSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrcamentosSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrcamentosSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

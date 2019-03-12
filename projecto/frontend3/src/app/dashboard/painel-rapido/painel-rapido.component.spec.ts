import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelRapidoComponent } from './painel-rapido.component';

describe('PainelRapidoComponent', () => {
  let component: PainelRapidoComponent;
  let fixture: ComponentFixture<PainelRapidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PainelRapidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelRapidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

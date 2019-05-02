import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncomendasHistoricoPageComponent } from './encomendas-historico-page.component';

describe('EncomendasHistoricoPageComponent', () => {
  let component: EncomendasHistoricoPageComponent;
  let fixture: ComponentFixture<EncomendasHistoricoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncomendasHistoricoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncomendasHistoricoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelRapidoPageComponent } from './painel-rapido-page.component';

describe('PainelRapidoPageComponent', () => {
  let component: PainelRapidoPageComponent;
  let fixture: ComponentFixture<PainelRapidoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PainelRapidoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelRapidoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

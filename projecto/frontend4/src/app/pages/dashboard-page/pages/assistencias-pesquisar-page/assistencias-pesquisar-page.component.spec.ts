import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistenciasPesquisarPageComponent } from './assistencias-pesquisar-page.component';

describe('AssistenciasPesquisarPageComponent', () => {
  let component: AssistenciasPesquisarPageComponent;
  let fixture: ComponentFixture<AssistenciasPesquisarPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistenciasPesquisarPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistenciasPesquisarPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistenciasPesquisarModalComponent } from './assistencias-pesquisar-modal.component';

describe('AssistenciasPesquisarModalComponent', () => {
  let component: AssistenciasPesquisarModalComponent;
  let fixture: ComponentFixture<AssistenciasPesquisarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistenciasPesquisarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistenciasPesquisarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

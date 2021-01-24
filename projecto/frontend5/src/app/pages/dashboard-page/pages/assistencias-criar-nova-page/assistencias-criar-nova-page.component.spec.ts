import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistenciasCriarNovaPageComponent } from './assistencias-criar-nova-page.component';

describe('AssistenciasCriarNovaPageComponent', () => {
  let component: AssistenciasCriarNovaPageComponent;
  let fixture: ComponentFixture<AssistenciasCriarNovaPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistenciasCriarNovaPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistenciasCriarNovaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

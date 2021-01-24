import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistenciasConcluidasPageComponent } from './assistencias-concluidas-page.component';

describe('AssistenciasConcluidasPageComponent', () => {
  let component: AssistenciasConcluidasPageComponent;
  let fixture: ComponentFixture<AssistenciasConcluidasPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistenciasConcluidasPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistenciasConcluidasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

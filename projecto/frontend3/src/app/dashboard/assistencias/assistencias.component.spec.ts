import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistenciasComponent } from './assistencias.component';

describe('AssistenciasComponent', () => {
  let component: AssistenciasComponent;
  let fixture: ComponentFixture<AssistenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

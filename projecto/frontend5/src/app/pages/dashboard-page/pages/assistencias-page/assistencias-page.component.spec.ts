import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistenciasPageComponent } from './assistencias-page.component';

describe('AssistenciasPageComponent', () => {
  let component: AssistenciasPageComponent;
  let fixture: ComponentFixture<AssistenciasPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistenciasPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistenciasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistenciaPageComponent } from './assistencia-page.component';

describe('AssistenciaPageComponent', () => {
  let component: AssistenciaPageComponent;
  let fixture: ComponentFixture<AssistenciaPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistenciaPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistenciaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

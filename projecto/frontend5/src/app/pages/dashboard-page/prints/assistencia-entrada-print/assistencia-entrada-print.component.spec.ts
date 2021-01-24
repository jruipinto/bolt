import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssistenciaEntradaPrintComponent } from './assistencia-entrada-print.component';

describe('AssistenciaEntradaPrintComponent', () => {
  let component: AssistenciaEntradaPrintComponent;
  let fixture: ComponentFixture<AssistenciaEntradaPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistenciaEntradaPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistenciaEntradaPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

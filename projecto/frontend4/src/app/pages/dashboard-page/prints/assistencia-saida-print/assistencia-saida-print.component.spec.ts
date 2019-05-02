import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistenciaSaidaPrintComponent } from './assistencia-saida-print.component';

describe('AssistenciaSaidaPrintComponent', () => {
  let component: AssistenciaSaidaPrintComponent;
  let fixture: ComponentFixture<AssistenciaSaidaPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistenciaSaidaPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistenciaSaidaPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

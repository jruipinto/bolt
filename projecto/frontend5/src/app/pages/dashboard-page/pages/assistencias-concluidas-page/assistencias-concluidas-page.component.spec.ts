import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssistenciasConcluidasPageComponent } from './assistencias-concluidas-page.component';

describe('AssistenciasConcluidasPageComponent', () => {
  let component: AssistenciasConcluidasPageComponent;
  let fixture: ComponentFixture<AssistenciasConcluidasPageComponent>;

  beforeEach(waitForAsync(() => {
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

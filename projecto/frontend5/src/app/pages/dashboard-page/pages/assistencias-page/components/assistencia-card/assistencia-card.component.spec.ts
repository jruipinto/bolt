import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistenciaCardComponent } from './assistencia-card.component';

describe('AssistenciaCardComponent', () => {
  let component: AssistenciaCardComponent;
  let fixture: ComponentFixture<AssistenciaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssistenciaCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistenciaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

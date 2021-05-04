import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistenciaRowComponent } from './assistencia-row.component';

describe('AssistenciaRowComponent', () => {
  let component: AssistenciaRowComponent;
  let fixture: ComponentFixture<AssistenciaRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssistenciaRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistenciaRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

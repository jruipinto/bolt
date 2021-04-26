import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistenciaInfoComponent } from './assistencia-info.component';

describe('AssistenciaInfoComponent', () => {
  let component: AssistenciaInfoComponent;
  let fixture: ComponentFixture<AssistenciaInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssistenciaInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistenciaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistenciaModalComponent } from './assistencia-modal.component';

describe('AssistenciaModalComponent', () => {
  let component: AssistenciaModalComponent;
  let fixture: ComponentFixture<AssistenciaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistenciaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistenciaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

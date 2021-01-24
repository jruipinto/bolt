import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssistenciaPageComponent } from './assistencia-page.component';

describe('AssistenciaPageComponent', () => {
  let component: AssistenciaPageComponent;
  let fixture: ComponentFixture<AssistenciaPageComponent>;

  beforeEach(waitForAsync(() => {
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

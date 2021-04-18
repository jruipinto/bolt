import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistenciaRowListComponent } from './assistencia-row-list.component';

describe('AssistenciaRowListComponent', () => {
  let component: AssistenciaRowListComponent;
  let fixture: ComponentFixture<AssistenciaRowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssistenciaRowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistenciaRowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

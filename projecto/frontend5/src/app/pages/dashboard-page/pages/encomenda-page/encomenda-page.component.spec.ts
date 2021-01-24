import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncomendaPageComponent } from './encomenda-page.component';

describe('EncomendaPageComponent', () => {
  let component: EncomendaPageComponent;
  let fixture: ComponentFixture<EncomendaPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncomendaPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncomendaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

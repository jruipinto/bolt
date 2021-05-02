import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionContentEncomendasComponent } from './accordion-content-encomendas.component';

describe('AccordionContentEncomendasComponent', () => {
  let component: AccordionContentEncomendasComponent;
  let fixture: ComponentFixture<AccordionContentEncomendasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccordionContentEncomendasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordionContentEncomendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

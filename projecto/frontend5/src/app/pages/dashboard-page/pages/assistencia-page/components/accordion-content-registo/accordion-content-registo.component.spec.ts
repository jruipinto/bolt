import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionContentRegistoComponent } from './accordion-content-registo.component';

describe('AccordionContentRegistoComponent', () => {
  let component: AccordionContentRegistoComponent;
  let fixture: ComponentFixture<AccordionContentRegistoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccordionContentRegistoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordionContentRegistoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

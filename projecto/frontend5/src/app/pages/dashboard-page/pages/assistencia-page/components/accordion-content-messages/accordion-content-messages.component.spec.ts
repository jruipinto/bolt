import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionContentMessagesComponent } from './accordion-content-messages.component';

describe('AccordionContentMessagesComponent', () => {
  let component: AccordionContentMessagesComponent;
  let fixture: ComponentFixture<AccordionContentMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccordionContentMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordionContentMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

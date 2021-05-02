import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionContentMaterialComponent } from './accordion-content-material.component';

describe('AccordionContentMaterialComponent', () => {
  let component: AccordionContentMaterialComponent;
  let fixture: ComponentFixture<AccordionContentMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccordionContentMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordionContentMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

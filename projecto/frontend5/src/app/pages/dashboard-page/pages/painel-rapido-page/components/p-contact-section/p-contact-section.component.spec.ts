import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PContactSectionComponent } from './p-contact-section.component';

describe('PContactSectionComponent', () => {
  let component: PContactSectionComponent;
  let fixture: ComponentFixture<PContactSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PContactSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PContactSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

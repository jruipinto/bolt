import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncomendasSectionComponent } from './encomendas-section.component';

describe('EncomendasSectionComponent', () => {
  let component: EncomendasSectionComponent;
  let fixture: ComponentFixture<EncomendasSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncomendasSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncomendasSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

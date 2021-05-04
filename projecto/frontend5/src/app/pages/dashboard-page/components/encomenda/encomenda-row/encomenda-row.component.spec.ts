import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncomendaRowComponent } from './encomenda-row.component';

describe('EncomendaRowComponent', () => {
  let component: EncomendaRowComponent;
  let fixture: ComponentFixture<EncomendaRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncomendaRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncomendaRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncomendaRowListComponent } from './encomenda-row-list.component';

describe('EncomendaRowListComponent', () => {
  let component: EncomendaRowListComponent;
  let fixture: ComponentFixture<EncomendaRowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncomendaRowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncomendaRowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

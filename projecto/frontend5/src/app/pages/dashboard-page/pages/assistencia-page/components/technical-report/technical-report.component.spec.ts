import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalReportComponent } from './technical-report.component';

describe('TechnicalReportComponent', () => {
  let component: TechnicalReportComponent;
  let fixture: ComponentFixture<TechnicalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicalReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

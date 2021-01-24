import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CwPageHomeComponent } from './cw-page-home.component';

describe('CwPageHomeComponent', () => {
  let component: CwPageHomeComponent;
  let fixture: ComponentFixture<CwPageHomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CwPageHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwPageHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

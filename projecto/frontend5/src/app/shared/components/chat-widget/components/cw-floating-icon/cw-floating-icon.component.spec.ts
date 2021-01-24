import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CwFloatingIconComponent } from './cw-floating-icon.component';

describe('CwFloatingIconComponent', () => {
  let component: CwFloatingIconComponent;
  let fixture: ComponentFixture<CwFloatingIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CwFloatingIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwFloatingIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

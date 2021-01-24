import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CwMessageStateIconComponent } from './cw-message-state-icon.component';

describe('CwMessageStateIconComponent', () => {
  let component: CwMessageStateIconComponent;
  let fixture: ComponentFixture<CwMessageStateIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CwMessageStateIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwMessageStateIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

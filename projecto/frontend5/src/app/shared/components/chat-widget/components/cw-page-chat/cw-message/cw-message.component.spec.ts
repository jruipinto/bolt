import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CwMessageComponent } from './cw-message.component';

describe('CwMessageComponent', () => {
  let component: CwMessageComponent;
  let fixture: ComponentFixture<CwMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CwMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

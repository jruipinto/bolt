import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwMessageComponent } from './cw-message.component';

describe('CwMessageComponent', () => {
  let component: CwMessageComponent;
  let fixture: ComponentFixture<CwMessageComponent>;

  beforeEach(async(() => {
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

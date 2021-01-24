import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CwPageChatComponent } from './cw-page-chat.component';

describe('CwPageChatComponent', () => {
  let component: CwPageChatComponent;
  let fixture: ComponentFixture<CwPageChatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CwPageChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwPageChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwPageChatComponent } from './cw-page-chat.component';

describe('CwPageChatComponent', () => {
  let component: CwPageChatComponent;
  let fixture: ComponentFixture<CwPageChatComponent>;

  beforeEach(async(() => {
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

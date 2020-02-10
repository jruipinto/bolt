import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwChatPreviewComponent } from './cw-chat-preview.component';

describe('CwChatPreviewComponent', () => {
  let component: CwChatPreviewComponent;
  let fixture: ComponentFixture<CwChatPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwChatPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwChatPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

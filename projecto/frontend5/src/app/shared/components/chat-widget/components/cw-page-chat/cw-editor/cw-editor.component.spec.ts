import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwEditorComponent } from './cw-editor.component';

describe('CwEditorComponent', () => {
  let component: CwEditorComponent;
  let fixture: ComponentFixture<CwEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

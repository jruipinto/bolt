import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwHeaderComponent } from './cw-header.component';

describe('CwHeaderComponent', () => {
  let component: CwHeaderComponent;
  let fixture: ComponentFixture<CwHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

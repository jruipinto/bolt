import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarNovaComponent } from './criar-nova.component';

describe('CriarNovaComponent', () => {
  let component: CriarNovaComponent;
  let fixture: ComponentFixture<CriarNovaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriarNovaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarNovaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

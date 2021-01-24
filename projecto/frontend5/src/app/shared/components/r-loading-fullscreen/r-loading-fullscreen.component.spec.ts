import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RLoadingFullscreenComponent } from './r-loading-fullscreen.component';

describe('RLoadingFullscreenComponent', () => {
  let component: RLoadingFullscreenComponent;
  let fixture: ComponentFixture<RLoadingFullscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RLoadingFullscreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RLoadingFullscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

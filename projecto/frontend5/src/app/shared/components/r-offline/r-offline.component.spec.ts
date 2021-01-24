import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ROfflineComponent } from './r-offline.component';

describe('ROfflineComponent', () => {
  let component: ROfflineComponent;
  let fixture: ComponentFixture<ROfflineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ROfflineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ROfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

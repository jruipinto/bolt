import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RLoadingComponent } from './r-loading.component';

describe('RLoadingComponent', () => {
  let component: RLoadingComponent;
  let fixture: ComponentFixture<RLoadingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

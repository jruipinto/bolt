import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RLoadingComponent } from './r-loading.component';

describe('RLoadingComponent', () => {
  let component: RLoadingComponent;
  let fixture: ComponentFixture<RLoadingComponent>;

  beforeEach(async(() => {
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

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigsPageComponent } from './configs-page.component';

describe('ConfigsPageComponent', () => {
  let component: ConfigsPageComponent;
  let fixture: ComponentFixture<ConfigsPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

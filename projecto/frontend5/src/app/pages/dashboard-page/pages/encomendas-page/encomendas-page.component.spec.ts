import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EncomendasPageComponent } from './encomendas-page.component';

describe('EncomendasPageComponent', () => {
  let component: EncomendasPageComponent;
  let fixture: ComponentFixture<EncomendasPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EncomendasPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncomendasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EncomendasCriarNovaPageComponent } from './encomendas-criar-nova-page.component';

describe('EncomendasCriarNovaPageComponent', () => {
  let component: EncomendasCriarNovaPageComponent;
  let fixture: ComponentFixture<EncomendasCriarNovaPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EncomendasCriarNovaPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncomendasCriarNovaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

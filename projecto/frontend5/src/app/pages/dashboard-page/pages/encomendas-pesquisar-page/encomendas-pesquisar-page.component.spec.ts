import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EncomendasPesquisarPageComponent } from './encomendas-pesquisar-page.component';

describe('EncomendasPesquisarPageComponent', () => {
  let component: EncomendasPesquisarPageComponent;
  let fixture: ComponentFixture<EncomendasPesquisarPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EncomendasPesquisarPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncomendasPesquisarPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

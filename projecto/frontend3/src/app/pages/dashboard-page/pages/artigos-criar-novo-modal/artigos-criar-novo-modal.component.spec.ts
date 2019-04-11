import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtigosCriarNovoModalComponent } from './artigos-criar-novo-modal.component';

describe('ArtigosCriarNovoModalComponent', () => {
  let component: ArtigosCriarNovoModalComponent;
  let fixture: ComponentFixture<ArtigosCriarNovoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtigosCriarNovoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtigosCriarNovoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

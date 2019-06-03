import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtigoModalComponent } from './artigo-modal.component';

describe('ArtigoModalComponent', () => {
  let component: ArtigoModalComponent;
  let fixture: ComponentFixture<ArtigoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtigoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtigoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

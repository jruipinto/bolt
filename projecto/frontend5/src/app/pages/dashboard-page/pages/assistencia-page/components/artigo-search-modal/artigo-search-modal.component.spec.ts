import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtigoSearchModalComponent } from './artigo-search-modal.component';

describe('ArtigoSearchModalComponent', () => {
  let component: ArtigoSearchModalComponent;
  let fixture: ComponentFixture<ArtigoSearchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtigoSearchModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtigoSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

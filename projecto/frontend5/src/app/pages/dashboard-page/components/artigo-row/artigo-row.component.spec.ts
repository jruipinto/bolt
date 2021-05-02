import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtigoRowComponent } from './artigo-row.component';

describe('ArtigoRowComponent', () => {
  let component: ArtigoRowComponent;
  let fixture: ComponentFixture<ArtigoRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtigoRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtigoRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

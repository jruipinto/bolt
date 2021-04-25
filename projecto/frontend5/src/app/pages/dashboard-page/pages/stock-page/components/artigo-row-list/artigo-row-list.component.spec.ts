import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtigoRowListComponent } from './artigo-row-list.component';

describe('ArtigoRowListComponent', () => {
  let component: ArtigoRowListComponent;
  let fixture: ComponentFixture<ArtigoRowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtigoRowListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtigoRowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

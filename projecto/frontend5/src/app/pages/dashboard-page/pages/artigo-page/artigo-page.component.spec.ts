import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArtigoPageComponent } from './artigo-page.component';

describe('ArtigoPageComponent', () => {
  let component: ArtigoPageComponent;
  let fixture: ComponentFixture<ArtigoPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtigoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtigoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

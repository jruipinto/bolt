import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TecnicoSelectModalComponent } from './tecnico-select-modal.component';

describe('TecnicoSelectModalComponent', () => {
  let component: TecnicoSelectModalComponent;
  let fixture: ComponentFixture<TecnicoSelectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TecnicoSelectModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TecnicoSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

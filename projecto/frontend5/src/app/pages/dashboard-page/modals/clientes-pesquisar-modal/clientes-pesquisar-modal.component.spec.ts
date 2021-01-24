import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesPesquisarModalComponent } from './clientes-pesquisar-modal.component';

describe('ClientesPesquisarModalComponent', () => {
  let component: ClientesPesquisarModalComponent;
  let fixture: ComponentFixture<ClientesPesquisarModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientesPesquisarModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientesPesquisarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

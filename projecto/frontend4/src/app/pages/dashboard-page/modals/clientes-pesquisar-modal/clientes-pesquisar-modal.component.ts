import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared';
import { UsersService } from 'src/app/shared/state';

@Component({
  selector: 'app-clientes-pesquisar-modal',
  templateUrl: './clientes-pesquisar-modal.component.html',
  styleUrls: ['./clientes-pesquisar-modal.component.scss']
})
export class ClientesPesquisarModalComponent implements OnInit {
  @ViewChild('userSearchModalInput', { static: false }) userSearchModalInputEl: ElementRef<HTMLElement>;
  @Output() selectedCliente: EventEmitter<User> = new EventEmitter<User>();
  public loading = false;
  public modalOpen = false;
  public userSearchResults$: Observable<User[]>;

  public userSearchForm = this.fb.group({
    input: ['']
  });

  constructor(
    private users: UsersService,
    private fb: FormBuilder,
    private focusMonitor: FocusMonitor
  ) { }

  ngOnInit() {
  }

  open() {
    this.modalOpen = true;
    setTimeout(() => this.focusMonitor.focusVia(this.userSearchModalInputEl, 'program'), 0.1);
  }

  searchUser(input: string) {
    if (input) {
      const inputSplited = input.split(' ');
      const inputMapped = inputSplited.map(word =>
        '{"$or": [' +
        '{ "nome": { "$like": "%' + word + '%" }},' +
        '{ "contacto": { "$like": "%' + word + '%" }}' +
        ' ]}'
      );
      const dbQuery =
        '{' +
        '"query": {' +
        '"$sort": { "nome": "1", "contecto": "1"},' +
        '"$limit": "200",' +
        '"$and": [' +
        inputMapped +
        ']' +
        '}' +
        '}';

      this.userSearchResults$ = this.users
        .find(JSON.parse(dbQuery));
    }
  }

  selectUser(user: User) {
    // this.assistenciasSearchForm.patchValue({ cliente: clone(user.id) });
    this.selectedCliente.emit(user);
    this.modalOpen = false;
  }

}

import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared';
import { UsersService } from 'src/app/shared/state';

@Component({
  selector: 'app-clientes-pesquisar-modal',
  templateUrl: './clientes-pesquisar-modal.component.html',
  styleUrls: ['./clientes-pesquisar-modal.component.scss'],
})
export class ClientesPesquisarModalComponent {
  @Output() selectedCliente: EventEmitter<User> = new EventEmitter<User>();
  isModalOpen = false;
  userSearchResults$: Observable<User[]>;

  userSearchForm = this.fb.group({
    input: [''],
  });

  constructor(private users: UsersService, private fb: FormBuilder) {}

  open(): void {
    this.isModalOpen = true;
  }

  searchUser(input: string): void {
    if (!input) {
      return;
    }
    const inputSplited = input.split(' ');
    const inputMapped = inputSplited.map(
      (word) =>
        '{"$or": [' +
        '{ "nome": { "$like": "%' +
        word +
        '%" }},' +
        '{ "contacto": { "$like": "%' +
        word +
        '%" }}' +
        ' ]}'
    );
    const dbQuery =
      '{' +
      '"query": {' +
      '"$sort": { "nome": "1", "contacto": "1"},' +
      '"$limit": "200",' +
      '"$and": [' +
      inputMapped +
      ']' +
      '}' +
      '}';

    this.userSearchResults$ = this.users.find(JSON.parse(dbQuery));
  }

  selectUser(user: User): void {
    this.selectedCliente.emit(user);
    this.isModalOpen = false;
  }
}

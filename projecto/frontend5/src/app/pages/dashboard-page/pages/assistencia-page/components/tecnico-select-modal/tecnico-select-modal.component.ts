import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Assistencia, User } from 'src/app/shared';
import { UsersService } from 'src/app/shared/state';

@Component({
  selector: 'app-tecnico-select-modal',
  templateUrl: './tecnico-select-modal.component.html',
  styleUrls: ['./tecnico-select-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TecnicoSelectModalComponent {
  @Input() assistencia: Assistencia;
  isTecnicoSelectModalOpened = false;
  tecnicos$ = this.users.find({ query: { tipo: 'tecnico' } });

  constructor(private users: UsersService) {}

  replaceTecnicoBy(tecnico: User) {
    this.assistencia.tecnico_user_id = tecnico.id;
    this.assistencia.tecnico = tecnico.nome;
    this.isTecnicoSelectModalOpened = false;
  }
}

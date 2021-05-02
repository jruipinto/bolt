import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
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
  isModalOpen = false;
  tecnicos$ = this.users.find({ query: { tipo: 'tecnico' } });

  constructor(private users: UsersService, private cdr: ChangeDetectorRef) {}

  open(): void {
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  replaceTecnicoBy(tecnico: User): void {
    this.assistencia = {
      ...this.assistencia,
      tecnico_user_id: tecnico.id,
      tecnico: tecnico.nome,
    };
    this.isModalOpen = false;
  }
}

import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Encomenda } from 'src/app/shared';

@Component({
  selector: 'app-encomenda-row',
  templateUrl: './encomenda-row.component.html',
  styleUrls: ['./encomenda-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncomendaRowComponent {
  @Input() encomenda: Encomenda;

  constructor(private router: Router) {}

  openEncomenda(encomendaID: number) {
    return this.router.navigate(['/dashboard/encomenda', encomendaID]);
  }
}

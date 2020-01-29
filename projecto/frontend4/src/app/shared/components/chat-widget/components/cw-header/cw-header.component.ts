import { Component } from '@angular/core';
import { CwStateService } from '../../services/cw-state.service';

@Component({
  selector: 'app-cw-header',
  templateUrl: './cw-header.component.html',
  styleUrls: ['./cw-header.component.scss']
})
export class CwHeaderComponent {
  state$ = this.cws.state$;

  constructor(private cws: CwStateService) { }

  minimizeCw() {
    this.cws.patchState({ activeRoute: 'icon' });
  }

  goBack() {
    this.cws.patchState({ activeRoute: 'home' });
  }

}

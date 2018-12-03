import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-assistencias',
  templateUrl: './assistencias.component.html',
  styleUrls: ['./assistencias.component.scss']
})
export class AssistenciasComponent implements OnInit {
  assistencias$: any;

  constructor(private dataService: DataService) {
    this.dataService.find$('assistencias', {
      query: {
        $limit: 25
      }
    }).subscribe(u => this.assistencias$ = u.data);
  }

  ngOnInit() {
  }

  toogleModal(dummyObjectID: number): void {
    // https://stackblitz.com/edit/angular-diy-modal-from-dynamic-list?embed=1&file=src/app/dynamic-list/dynamic-list.component.ts
    const dummyObjectIndex: number = this.assistencias$
    .findIndex(i => i.id === dummyObjectID);

    if (this.assistencias$[dummyObjectIndex].expanded) {
      delete this.assistencias$[dummyObjectIndex].expanded;
      return;
    }

    Object.assign(this.assistencias$[dummyObjectIndex], { expanded: true });
  }

}

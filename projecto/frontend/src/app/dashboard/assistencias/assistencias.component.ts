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
    }).subscribe(u => {
      this.assistencias$ = u.data;
      this.getClientNameById();
    });
  }

  ngOnInit() {
  }

  toogleModal(listaIndex: number): void {
    if (this.assistencias$[listaIndex].expanded) {
      delete this.assistencias$[listaIndex].expanded;
      return;
    }

    Object.assign(this.assistencias$[listaIndex], { expanded: true });
  }

  getClientNameById(): void {
    this.assistencias$.forEach((assistencia, index) => {
      this.dataService.get$('users', assistencia.cliente_user_id)
      .subscribe(e => {
        console.log(e);
        Object.assign(this.assistencias$[index], {cliente_user_name: e.nome});
        console.log(this.assistencias$[index]);
      });
    })
  }

}

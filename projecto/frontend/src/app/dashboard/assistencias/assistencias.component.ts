import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-assistencias',
  templateUrl: './assistencias.component.html',
  styleUrls: ['./assistencias.component.scss']
})
export class AssistenciasComponent implements OnInit {
  assistencias$: Observable<any[]>;

  constructor(private dataService: DataService) {
    this.dataService.find$('assistencias', {
      query: {
        $limit: 25
      }
    }).subscribe(u => this.assistencias$ = u.data);
   }

  ngOnInit() {
  }

}

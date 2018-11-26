import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private userName: string;

  constructor(private authService: AuthService, dataService: DataService) { }

  ngOnInit() {
    this.authService.getUserName$().subscribe(e => this.userName = e.nome);
  }

  logOut() {
    return this.authService.logOut();
  }

}

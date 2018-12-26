import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { StoreService } from '../shared/services/store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public userName: string;

  constructor(private authService: AuthService, private store: StoreService) { }

  ngOnInit() {
    this.authService.getUserName$().subscribe(e => this.userName = e.nome);
  }

  logOut() {
    return this.authService.logOut();
  }

}

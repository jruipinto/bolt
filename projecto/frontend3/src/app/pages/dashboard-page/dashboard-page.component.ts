import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  public userName: string;
  public sidebarVisible = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUserName$().subscribe(e => this.userName = e.nome);
  }

  logOut() {
    return this.authService.logOut();
  }

  toogleSidebar () {
    if (!this.sidebarVisible) {
      this.sidebarVisible = true;
    } else {
      this.sidebarVisible = false;
    }
  }

}

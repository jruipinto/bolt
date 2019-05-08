import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UI, UIService } from 'src/app/shared/rstate/ui.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  public userName: string;
  public sidebarVisible = false;

  constructor(private authService: AuthService, private uiService: UIService) { }

  public assistenciaModalVisible$: Observable<boolean> = this.uiService.state$
  .pipe(
    map((uiState: UI) => uiState.assistenciaModalVisible)
  );

  ngOnInit() {
    this.authService.getUserName$().subscribe(res => this.userName = res[0].nome);
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

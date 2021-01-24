import { Component, OnDestroy } from '@angular/core';
import { Router, RouteConfigLoadEnd, RouteConfigLoadStart } from '@angular/router';
import { FeathersService } from './shared';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  public loading = false;
  public offline: boolean;
  public title = 'frontend';

  constructor(
    private router: Router,
    private feathers: FeathersService) {
    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof RouteConfigLoadStart: {
          this.loading = true;
          break;
        }
        case event instanceof RouteConfigLoadEnd: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
      this.feathers.offline$().subscribe(e => this.offline = e);
    });
  }

  ngOnDestroy() {
  }
}

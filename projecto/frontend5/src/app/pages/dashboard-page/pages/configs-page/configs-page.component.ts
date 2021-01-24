import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ConfigsApiService } from 'src/app/shared';

@Component({
  templateUrl: './configs-page.component.html',
  styleUrls: ['./configs-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigsPageComponent implements OnInit {
  public configs$ = this.configsApiService.find();

  constructor(private configsApiService: ConfigsApiService) { }

  ngOnInit() {
  }

}

import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigsApiService } from 'src/app/shared';

interface Config {
  value: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  templateUrl: './configs-page.component.html',
  styleUrls: ['./configs-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigsPageComponent implements OnInit {
  configs$ = (this.configsApiService.find() as Observable<Config[]>).pipe(
    map((configs) =>
      configs.map((config) => ({
        ...config,
        value: (config.value as string).split(';'),
      }))
    )
  );

  constructor(private configsApiService: ConfigsApiService) {}

  ngOnInit() {}
}

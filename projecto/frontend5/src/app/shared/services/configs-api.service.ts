import { Injectable } from '@angular/core';

import { EntityApiAbstration } from 'src/app/shared/abstraction-classes';
import { FeathersService } from './feathers.service';

@Injectable({
    providedIn: 'root'
})
export class ConfigsApiService extends EntityApiAbstration {

    constructor(protected feathersService: FeathersService) {
        super(feathersService, 'configs');
    }

}

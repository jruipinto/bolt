export class EntitiesApiAbstration {
    protected entity: string|null = null;
    constructor() {}
    find(query?: string) {
      console.log(`[${this.entity} API] find ${this.entity}`);
    }
    get(id: number) {
      console.log(`[${this.entity} API] get ${this.entity}`);
    }
    create(data: object, actionType?: string) {
      console.log(actionType);
    }
    patch(id: number, data: object, actionType?: string) {
      console.log(actionType);
    }
  }
  
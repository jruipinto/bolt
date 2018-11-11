const assert = require('assert');
const app = require('../../src/app');

describe('\'encomendas\' service', () => {
  it('registered the service', () => {
    const service = app.service('encomendas');

    assert.ok(service, 'Registered the service');
  });
});

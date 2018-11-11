const assert = require('assert');
const app = require('../../src/app');

describe('\'artigos\' service', () => {
  it('registered the service', () => {
    const service = app.service('artigos');

    assert.ok(service, 'Registered the service');
  });
});

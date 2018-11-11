const assert = require('assert');
const app = require('../../src/app');

describe('\'assistencias\' service', () => {
  it('registered the service', () => {
    const service = app.service('assistencias');

    assert.ok(service, 'Registered the service');
  });
});

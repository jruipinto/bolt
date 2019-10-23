const { authenticate } = require('@feathersjs/authentication').hooks;
const authenticateAfterFirstUse = require('../../hooks/authenticate-after-first-use');

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    /*create: [ hashPassword(), authenticateAfterFirstUse('jwt', 'tecnico', 'users') ],
    update: [ hashPassword(),  authenticateAfterFirstUse('jwt', 'tecnico', 'users') ],
    patch: [ hashPassword(),  authenticateAfterFirstUse('jwt', 'tecnico', 'users') ],
    remove: [ authenticateAfterFirstUse('jwt', 'tecnico', 'users') ]*/
    create: [ hashPassword(), authenticate('jwt') ],
    update: [ hashPassword(),  authenticate('jwt') ],
    patch: [ hashPassword(),  authenticate('jwt') ],
    remove: [ authenticate('jwt') ]

  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

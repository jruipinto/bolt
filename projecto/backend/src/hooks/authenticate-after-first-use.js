const { NotAuthenticated } = require('@feathersjs/errors');
const { authenticate } = require('@feathersjs/authentication').hooks;
/**
* Detects if it's the first use of the API
* (by checking if there's already any user with Admin's role on DB)
* If not, then it only let's new users to be created by Admins
*/
module.exports = (authStrategy, roleName, usersService) => async (context) => {
  const role = context.params.user.tipo ? context.params.user.tipo : null;

  if (role === roleName) return authenticate(authStrategy)(context);

  const { total } = await context.app.service(usersService).find({
    query: {
      $limit: 0,
      tipo: roleName
    }
  });

  if (role !== roleName && total > 0) {
    throw new NotAuthenticated();
  }
  return context;
}
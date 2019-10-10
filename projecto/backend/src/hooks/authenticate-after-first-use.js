const jwtDecode = require('jwt-decode');
const { NotAuthenticated } = require('@feathersjs/errors');
/**
* Detects if it's the first use of the API
* (by checking if there's already any user with Admin's role on DB)
* If not, then it only let's new users to be created by Admins
*/
module.exports = (authStrategy, roleName, usersService) => async (context) => {
  const jwt = context.params.authentication && context.params.authentication.accessToken
    ? jwtDecode(context.params.authentication.accessToken)
    : null;
  const userID = jwt ? jwt.sub : null;
  const user = userID ? await context.app.service(usersService).get(userID) : null;
  const role = user ? user.tipo : null;

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
//An implementation of JSON Web Tokens.
//生成token
import jwt from 'jsonwebtoken';

export default ctx => {
  //console.log(ctx.request.body);
  if (ctx.request.body.password === 'password') {
    ctx.status = 200;
    ctx.body = {
      token: jwt.sign(
        {
          role: 'admin'
        },
        'YourKey'
      ), // Store this key in an environment variable, use at http header
      message: 'Successful Authentication'
    };
  } else {
    ctx.status = 401;
    ctx.body = {
      message: 'Authentication Failed'
    };
  }
  return ctx;
};

// jwt.verify(token, 'YourKey', function(err, decoded) {
//   console.log(decoded);
// });

import jwt from 'jsonwebtoken';

export const AuthenticateToken = (request, response, next) => {

  const authHeader = request.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];

  const accessToken = request.cookies.accessToken;

  if (!accessToken)
    return response.status(401).json({ message: 'Unauthorized. Token does not exit.' });

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return response.status(403).json({ message: 'Forbidden. There is not access.', error });
    }
    request.user = decoded;
    next();
  })
}

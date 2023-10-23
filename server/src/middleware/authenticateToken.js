import jwt from 'jsonwebtoken';

export function AuthenticateToken(request, response, next) {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return response.status(401).json({ message: 'Unauthorized. Token does not exit.' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return response.status(403).json({ message: 'Forbidden. There is not access.' });
    request.user = user;
    next();
  })
}
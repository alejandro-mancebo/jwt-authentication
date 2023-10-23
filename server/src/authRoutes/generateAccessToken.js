import jwt from 'jsonwebtoken';

export function GenerateAccessToken(userId) {
  const token = jwt.sign(userId, process.env.ACCESS_TOKEN_SECRET);
  // console.log('user id:', userId);
  // console.log('token:', token);
  return jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}
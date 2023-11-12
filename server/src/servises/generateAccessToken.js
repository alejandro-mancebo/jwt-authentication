import jwt from 'jsonwebtoken';

const GenerateAccessToken = (user, durationTime) => {
  return jwt.sign({ userId: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: durationTime });
}


export { GenerateAccessToken }
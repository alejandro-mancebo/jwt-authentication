import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


const handleLogout = async (request, response) => {
  // On client, also delete the accessToken

  const cookies = request.cookies;
  if (!cookies?.jwt) return response.sendStatus(204); // No content

  const refreshToken = cookies.jwt;

  // Find the user has refresh token
  const foundUser = await User.findOne({ refreshToken }).exec();

  // Check if there are any user. If there aren't return
  if (!foundUser) {
    response.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return response.sendStatus(204);
  }

  // Delete refreshToken in the database
  foundUser.refreshToken = '';
  console.log(foundUser)
  await foundUser.save();

  response.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  return response.sendStatus(204);
}

export default { handleLogout };

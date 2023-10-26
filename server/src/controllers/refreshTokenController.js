import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


const handleRefreshToken = async (request, response) => {

  const cookies = request.cookies;
  if (!cookies?.jwt) return response.sendStatus(401);

  console.log("cookies.jwt", cookies.jwt);
  const refreshToken = cookies.jwt;

  // Find the user using refresh token
  const foundUser = await User.findOne({ refreshToken }).exec();

  // Check if there are any user. If there aren't return
  if (!foundUser)
    return response.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, decoded) => {
      if (error || foundUser.email !== decoded.email)
        return response.sendStatus(403);

      const accessToken = jwt.sign(
        { "UserInfo": { "email": decoded.email, "role": decoded.role } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '60s' }
      );
      response.json({ accessToken: accessToken });
    }
  );
}

export default { handleRefreshToken };

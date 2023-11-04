import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


const handleRefreshToken = async (request, response) => {

  const cookies = request.cookies;
  // console.log('handleRefreshToken request.cookies', request.cookies);

  if (!cookies?.jwt) return response.sendStatus(401);

  // Create the refresh token from the cookies
  const refreshToken = cookies.jwt;

  // Delete the cookie
  // response.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

  // Find the user using refresh token
  const foundUser = await User.findOne({ refreshToken }).exec();
  // console.log('Find the user using refresh token foundUser:', refreshToken);

  // if there are any user detected refresh token reuse
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, decoded) => {
        // console.log('handleRefreshToken decoded:', decoded)
        if (error) return response.sendStatus(403); // Forbidden
        // console.log('attempted refresh token reuse!')
        const hackedUser = await User.findOne({ email: decoded.email }).exec();
        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
        console.log('Result hackedUser:', result);
      });
    return response.sendStatus(403); // Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);
  // console.log('resfreshTokenController newRefreshTokenArray:', newRefreshTokenArray)
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (error, decoded) => {
      if (error) {
        // console.log('expired refresh token')
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
      }

      if (error || foundUser.email !== decoded.email)
        return response.sendStatus(403); // Forbbiden

      // Refresh token was still valid
      const accessToken = jwt.sign(
        { "UserInfo": { "email": decoded.email, "role": decoded.role } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '60s' }
      );


      const newRefreshToken = jwt.sign({ "email": foundUser.email },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

      //saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();

      // Creates Secure Cookie with refresh token
      response.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });


      response.json({ email: foundUser.email, accessToken: accessToken });
    }
  );
}

export default { handleRefreshToken };

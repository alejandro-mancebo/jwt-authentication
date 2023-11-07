import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Constant for cookies names and for cookies expired time
const { TOKEN_NAME, USER_NAME } = process.env;
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const MAX_AGE = 24 * 60 * 60 * 1000;


const handleRefreshToken = async (request, response) => {
  console.log('\n');
  // get request cookies from the browser
  const cookies = request.cookies;
  console.log('refreshTokenController request.cookies:', cookies);

  if (!cookies?.jwt) return response.sendStatus(401);

  // Create the refresh token from the cookies
  const refreshToken = cookies.jwt;

  // Delete the cookie
  // response.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

  // Find user using refresh token
  const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
  console.log('> refreshTokenController - Find refresh token:', refreshToken);
  console.log('> refreshTokenController - Find User using refresh token:', foundUser);

  // if there are any user detected refresh token reuse
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, decoded) => {
        console.log('refreshTokenController verify - decoded:', decoded)
        if (error) return response.sendStatus(403); // Forbidden
        const hackedUser = await User.findOne({ email: decoded.email }).exec();

        // Note: why set user refreshToken array to empty
        // hackedUser.refreshToken = [];

        const result = await hackedUser.save();
        // console.log('Result hackedUser:', result);
      });
    return response.sendStatus(403); // Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);
  console.log('resfreshTokenController newRefreshTokenArray:', newRefreshTokenArray)
  jwt.verify(
    refreshToken,
    REFRESH_TOKEN_SECRET,
    async (error, decoded) => {
      console.log('refreshTokenController verify error:', error);
      if (error) {
        foundUser.refreshToken = [...newRefreshTokenArray];
        await foundUser.save();
      }

      if (error || foundUser.email !== decoded.email) {
        console.log('(error || foundUser.email: ', foundUser.email);
        console.log('(error || decoded.email: ', decoded);
        return response.sendStatus(403); // Forbbiden
      }

      // Refresh token was still valid
      const accessToken = jwt.sign({ 'email': decoded.email, "role": decoded.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '60s' }
      );


      const newRefreshToken = jwt.sign({ 'email': foundUser.email, "role": decoded.role },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' });

      //saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      await foundUser.save();

      // Creates Secure Cookie with refresh token
      response.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: MAX_AGE });
      response.cookie('email', decoded.email, { httpOnly: true, secure: true, sameSite: 'None', maxAge: MAX_AGE });

      response.json({ email: foundUser.email, accessToken: accessToken });
    }
  ).catch(error => {
    console.log('refreshTokenController error:', error);
    return response.sendStatus(403); // Forbbiden
  });
}

export default { handleRefreshToken };

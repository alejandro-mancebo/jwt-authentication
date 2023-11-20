import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { error } from 'console';

// Constant for cookies names and for cookies expired time
const { TOKEN_NAME, USER_NAME } = process.env;
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const MAX_AGE = 24 * 60 * 60 * 1000;


const handleRefreshToken = async (request, response) => {

  // get request cookies from the browser
  const cookies = request.cookies;

  if (!cookies?.jwt) return response.sendStatus(401);

  // Create the refresh token from the cookies
  const refreshToken = cookies.jwt;

  // Delete the cookie
  // response.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

  // Find user using refresh token
  const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();

  // if there are any user detected refresh token reuse
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, decoded) => {
        if (error) return response.sendStatus(403); // Forbidden

        const hackedUser = await User.findOne({ _id: decoded._id }).exec();

        // Note: why set user refreshToken array to empty
        // hackedUser.refreshToken = [];

        const result = await hackedUser.save();
      });
    return response.sendStatus(403); // Forbidden
  }


  const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);
  jwt.verify(
    refreshToken,
    REFRESH_TOKEN_SECRET,
    async (error, decoded) => {
      if (error) {
        foundUser.refreshToken = [...newRefreshTokenArray];
        await foundUser.save();
      }

      if (error || foundUser._id.toJSON() !== decoded._id) {
        return response.sendStatus(403); // Forbbiden
      }

      // Refresh token was still valid
      const accessToken = jwt.sign({ '_id': decoded._id, "role": decoded.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' }
      );


      const newRefreshToken = jwt.sign({ '_id': foundUser._id.toJSON(), "role": decoded.role },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '1w' });

      //saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      await foundUser.save();

      // Creates Secure Cookie with refresh token
      response.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: MAX_AGE });

      response.json({ _id: foundUser._id.toJSON(), accessToken: accessToken });
    }
  ).catch(error => {
    console.error('[refreshTokenController] error:', error);
    return response.sendStatus(403); // Forbbiden
  });
}


const handleRefreshToken1 = async (request, response) => {
  try {


    // get refresh token from cookies from the browser request
    const refreshToken = request.cookies.refreshToken;

    // verify if refresh token exist. it isnot send a forbbiden
    // if (!cookies?.refreshToken)
    //   return response.sendStatus(401);

    // Create the refresh token from the cookies
    // const refreshToken = cookies.refreshToken;

    // Find user using refresh token
    // const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();


    // if there are any user detected refresh token reuse
    // if (foundUser === null) {
    //   jwt.verify(
    //     refreshToken,
    //     process.env.REFRESH_TOKEN_SECRET,
    //     async (error, decoded) => {
    //       if (error) return response.sendStatus(403); // Forbidden

    //       const hackedUser = await User.findOne({ _id: decoded._id }).exec();

    //       // Note: why set user refreshToken array to empty
    //       hackedUser.refreshToken = [];

    //       await hackedUser.save();
    //     });
    //   return response.sendStatus(403); // Forbidden
    // }


    //---------------------------------------------
    //  if there are any user detected refresh token reuse

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (error, decoded) => {
        if (error) return response.sendStatus(403); // Forbidden

        const accessToken = jwt.sign({ '_id': decoded._id, "role": decoded.role },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '10s' }
        );

        response.cookie('accessToken', accessToken,
          { httpOnly: true, secure: true, sameSite: 'None', maxAge: MAX_AGE }
        ); // 1 day

        const hackedUser = await User.findOne({ _id: decoded._id }).exec();

        // Note: why set user refreshToken array to empty
        // hackedUser.refreshToken = [];

        await hackedUser.save();

        return response.json({ _id: hackedUser._id.toJSON(), name: hackedUser.name, accessToken: accessToken });

      }).catch(error => {
        console.error(error)
        response.sendStatus(401); // Unauthorized
      });

    // return response.sendStatus(403); // Forbidden

    //--------------------






    // const refreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);
    // jwt.verify(
    //   refreshToken,
    //   REFRESH_TOKEN_SECRET,
    //   async (error, decoded) => {
    //     if (error) {
    //       foundUser.refreshToken = [...refreshTokenArray];
    //       await foundUser.save();
    //     }

    //     if (error || foundUser._id.toJSON() !== decoded._id) {
    //       return response.sendStatus(403); // Forbbiden
    //     }

    //     // Refresh token was still valid
    //     const accessToken = jwt.sign({ '_id': decoded._id, "role": decoded.role },
    //       process.env.ACCESS_TOKEN_SECRET,
    //       { expiresIn: '10s' }
    //     );


    //     const refreshToken = jwt.sign({ '_id': foundUser._id.toJSON(), "role": decoded.role },
    //       REFRESH_TOKEN_SECRET,
    //       { expiresIn: '1w' });

    //     //saving refreshToken with current user
    //     foundUser.refreshToken = [...refreshTokenArray, refreshToken];
    //     await foundUser.save();

    //     // Creates Secure Cookie with refresh token
    //     response.cookie('accessToken', ACCESS_TOKEN_SECRET, { httpOnly: true, secure: true, sameSite: 'None', maxAge: MAX_AGE }); // 1 day

    //     response.json({ _id: foundUser._id.toJSON(), accessToken: accessToken });
    //   }
    // ).catch(error => {
    //   console.log('[refreshTokenController] error:', error);
    //   return response.sendStatus(403); // Forbbiden
    // });

  } catch (error) {
    console.error(error);
    return response.sendStatus(401); // Unauthorized
  }
}

export default { handleRefreshToken, handleRefreshToken1 };

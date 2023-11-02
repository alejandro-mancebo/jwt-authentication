import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import User from '../models/user.model.js';


const handleLogin = async (request, response) => {

  const cookies = request.cookies;
  console.log(`cookie available at login: ${JSON.stringify(cookies)}`);

  // Validate request data
  const error = validationResult(request);
  if (!error.isEmpty())
    response.status(400).json({ 'message': 'Email and password are required!!!' });

  const { email, password } = request.body.user;

  // Find and check if there are any user. If there aren't return
  const foundUser = await User.findOne({ email: email }).exec();
  if (!foundUser) return response.sendStatus(401); // Unauthorized


  try {
    // Evaluate password
    if (await bcrypt.compare(password, foundUser.password)) {
      // Create JWT token
      const accessToken = jwt.sign({ "UserInfo": { "email": foundUser.email, "role": foundUser.role } },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });

      // Create JWT refresh token
      const newRefreshToken = jwt.sign({ "email": foundUser.email },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

      // Changed to let keyword
      let newRefreshTokenArray =
        !cookies?.jwt
          ? foundUser.refreshToken
          : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

      if (cookies?.jwt) {
        /* 
        Scenario added here: 
          1) User logs in but never uses RT and does not logout 
          2) RT is stolen
          3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
        */

        const refreshToken = cookies.jwt;
        const foundToken = await User.findOne({ refreshToken }).exec();

        // Detected refresh token reuse!
        if (!foundToken) {
          console.log('attempted refresh token reuse at login!')
          // clear out ALL previous refresh tokens
          newRefreshTokenArray = [];
        }

        response.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
      }

      // Save refreshToken to the user in the database
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();
      console.log('authController foundUser:', result);

      // Note: secure: true at production
      //response.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

      // Create Secure Cookie with refresh token
      response.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

      response.cookie('email', foundUser.email, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

      // Send the user found and the accessTokend
      response.status(201).json({ user: foundUser, accessToken: accessToken });

    } else {
      response.status(401).send({ message: 'Not Allowed' });
    }
  } catch (error) {
    console.log(error.message)
    response.status(500).send({ error: error.message })
  }
}


export default { handleLogin };

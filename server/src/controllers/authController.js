import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import User from '../models/user.model.js';


const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const MAX_AGE = 24 * 60 * 60 * 1000;


const handleLogin = async (request, response) => {

  const cookies = request.cookies;
  console.log(`authController cookie available at login: ${JSON.stringify(cookies)}`);

  // Validate request data
  const error = validationResult(request);
  if (!error.isEmpty())
    response.status(400).json({ 'message': 'Email and password are required!!!' });

  // Destructing user valiables
  const { email, password } = request.body.user;

  // Find and check if there are any user. If there aren't return
  const foundUser = await User.findOne({ email: email }).exec();
  if (!foundUser) return response.sendStatus(401); // Unauthorized

  try {
    // Evaluate password
    if (await bcrypt.compare(password, foundUser.password)) {

      const id = foundUser._id.toJSON();

      // Generate access token
      const accessToken = jwt.sign({ '_id': id, "role": foundUser.role },
        ACCESS_TOKEN_SECRET, { expiresIn: '10s' });

      // Generate refresh token
      const refreshToken = jwt.sign({ '_id': id, "role": foundUser.role },
        REFRESH_TOKEN_SECRET, { expiresIn: '1w' });

      // Changed to let keyword
      let refreshTokenArray =
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
        const foundToken = await User.findOne({ refreshToken: refreshToken }).exec();

        // Detected refresh token reuse!
        if (!foundToken) {
          // clear out ALL previous refresh tokens
          newRefreshTokenArray = [];
        }

        // Note: Review its implication when refresh the browser
        // response.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
      }

      // Save refreshToken to the user in the database
      foundUser.refreshToken = [...refreshTokenArray, refreshToken];
      await foundUser.save();

      // Note: secure: true at production
      // response.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', maxAge: MAX_AGE });

      // Create Secure Cookie with access token
      response.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: MAX_AGE }); // 1 day

      // Create Secure Cookie with refresh token
      response.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 7 * MAX_AGE }); // 1 week

      // Send found user and accessToken
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

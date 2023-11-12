import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import User from '../models/user.model.js';


const { TOKEN_NAME_KEY, USER_NAME_KEY } = process.env;
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const MAX_AGE = 24 * 60 * 60 * 1000;


const handleLogin = async (request, response) => {
  console.log('\n');
  const cookies = request.cookies;
  console.log(`authController cookie available at login: ${JSON.stringify(cookies)}`);

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
      // Generate JWT token

      const accessToken = jwt.sign({ 'email': foundUser.email, "role": foundUser.role },
        ACCESS_TOKEN_SECRET, { expiresIn: '60s' });

      // Create JWT refresh token
      const newRefreshToken = jwt.sign({ 'email': foundUser.email, "role": foundUser.role },
        REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

      // Changed to let keyword
      let newRefreshTokenArray =
        !cookies?.jwt
          ? foundUser.refreshToken
          : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

      console.log('foundUser.refreshToken:', foundUser.refreshToken)
      console.log('foundUser.refreshToken.filter(rt => rt !== cookies.jwt):', foundUser.refreshToken.filter(rt => rt !== cookies.jwt))

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
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      await foundUser.save();

      // Note: secure: true at production
      // response.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', maxAge: MAX_AGE });

      // Create Secure Cookie with refresh token
      response.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: MAX_AGE });
      response.cookie('email', foundUser.email, { httpOnly: true, secure: true, sameSite: 'None', maxAge: MAX_AGE });

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

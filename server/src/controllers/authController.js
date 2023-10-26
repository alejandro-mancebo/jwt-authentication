import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import User from '../models/user.model.js';


const handleLogin = async (request, response) => {

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
      const accessToken = jwt.sign({ "UserInfo": { email: foundUser.email, role: foundUser.role } },
        process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });

      // Create JWT refresh token
      const refreshToken = jwt.sign({ email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' });

      // Save refreshToken to the user in the database
      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      // Note: secure: true at production
      response.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

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

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import User from '../models/user.model.js';


const router = Router();

//Note: Change this var to a database
let refreshTokens = [];

const handleLogin = async (request, response) => {

  // Validate request data
  const error = validationResult(request);
  if (!error.isEmpty())
    response.status(400).json({ 'message': 'Email and password are required!!!' });


  const { email, password } = request.body;

  // Find the user
  const user = await User.findOne({ email: email });

  // Check if there are any user. If there aren't return
  if (user == null)
    return response.status(401).json({ message: 'User not found' });

  try {
    // Evaluate password
    if (await bcrypt.compare(password, user.password)) {
      // Create JWT token
      const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

      // Create JWT refresh token
      const refreshToken = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
      refreshTokens.push(refreshToken);

      response.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

      response.status(201).json({ accessToken: accessToken });

      // response.json({ accessToken: accessToken, refreshToken });

    } else {
      response.status(401).send({ message: 'Not Allowed' });
    }
  } catch (error) {
    console.log(error)
    response.status(500).send({ error: error.message })
  }
}


export default { handleLogin };

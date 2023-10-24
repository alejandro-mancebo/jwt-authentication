import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import User from '../models/user.model.js';


const router = Router();

//Note: Change this var to a database
// let refreshTokens = [];

const handleRefreshToken = (request, response) => {

  const cookies = request.cookies;
  if (!cookies?.jwt) return response.sendStatus(401);
  console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  // Find the user
  const foundUser = User.findOne({ email: email });

  // Check if there are any user. If there aren't return
  if (!user)
    return response.sendStatus(403);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, decoded) => {
      if (error || foundUser.email !== decoded.email)
        return response.sendStatus(403);
      const accessToken = jwt.sign(
        { email: decoded.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '60s' }
      );

      response.json({ accessToken });

    }
  );
}

export default { handleRefreshToken };

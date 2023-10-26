import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import { GenerateAccessToken } from './generateAccessToken.js';

const router = Router();

router.delete('/logout', (request, response) => {
  refreshTokens = refreshTokens.filter(token => token !== request.body.token);
  response.status(204).json({ message: 'No Content. Successfully logout.' });
})


router.post('/token', (request, response) => {
  const refreshToken = request.body.token;
  if (refreshToken == null)
    return response.status(401).json({ message: 'Unauthorized. Token does not exit.' });

  if (!refreshTokens.includes(refreshToken))
    return response.status(403).json({ message: 'Forbbiden. There is not access.' });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
    if (error)
      return response.status(403).json({ message: 'Forbbiden. There is a error to access.' });

    const accessToken = GenerateAccessToken({ email: user.email });
    response.json({ accessToken: accessToken });
  })
});


router.post('/login', async (request, response) => {

  // Authenticate User
  const user = await User.findOne({ email: request.body.email });

  if (user == null)
    return response.status(401).send({ message: 'User not found' });
  try {
    if (await bcrypt.compare(request.body.password, user.password)) {
      const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
      const refreshToken = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

      response.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      response.status(201).json({ accessToken: accessToken });
    } else {
      response.status(401).send({ message: 'Not Allowed' });
    }
  } catch (error) {
    console.log(error)
    response.status(500).send({ error: error.message })
  }
});


router.post('/signup', async (request, response) => {

  // Validate request data
  const error = validationResult(request);
  if (!error.isEmpty())
    response.status(400).send({ message: 'Incorrect data' });

  // Get the user data from the body of the request 
  const { name, email, password, dayOfBirth, role } = request.body;

  // Start mongoose session to the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    // Create hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // create new user with encrypted password
    const createNewUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      dayOfBirth: dayOfBirth,
      role: role,
    });

    // Save the new user to the database
    await createNewUser.save();

    // End transaction 
    await session.commitTransaction();

    // Set and send status to the client
    response.status(201).json({ user: createNewUser.toObject({ getters: true }) });

  } catch (error) {

    // Abort transaction and send error message
    console.log(error.message)
    await session.abortTransaction();
    response.status(500).send({ message: error.message })

  } finally {

    // End mongoose session
    session.endSession();
  }
});

export default router;
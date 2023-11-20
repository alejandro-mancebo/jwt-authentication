import User from '../models/user.model.js';


const getAllUsers = async (request, response) => {
  const users = await User.find({});
  response.json(users);
};


const createNewUser = (request, response) => {
  const { email, password } = request.body;
  response.json({
    "email": email,
    "password": password,
  });
};


const updateUser = async (request, response) => {

  const { _id, firstName, lastName, email, dayOfBirth } = request.body.user;
  const filter = { _id: _id }
  const user = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    dayOfBirth: dayOfBirth,
  }

  try {
    await User.findByIdAndUpdate(filter, user);
    response.status(201).send({ message: 'success' });
  } catch (error) {
    console.error('update user error:', error.message);
  }
};


const deleteUser = async (request, response) => {
  const id = request.params.id;
  try {
    await User.findByIdAndDelete(id);
    response.status(200).send({ message: 'success' });
  } catch (error) {
    console.error('delete user error:', error.message);
  }
//response.json({ "id": request.body.id })
};


const getUser = async (request, response) => {
  const id = request.params.id;
  try {
    const foundUser = await User.findById(id);
    const dateDOB = new Date(foundUser.dayOfBirth).toLocaleDateString();
    const user = {
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      email: foundUser.email,
      dayOfBirth: dateDOB,
      role: foundUser.role,
    }
    response.json(user);
  } catch (error) {
    console.error(error.message);
  }

};


export default {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getUser
}
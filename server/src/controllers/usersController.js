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


const updateUser = (request, response) => {
  const { name, email, password, dayOfBirth, role } = request.body;
  response.json({
    "name": name,
    "email": email,
    "password": password,
    "dayOfBirth": dayOfBirth,
    "role": role
  });
};


const deleteUser = (request, response) => {
  response.json({ "id": request.body.id })
};


const getUser = (request, response) => {
  console.log('--------------------------', request.params.id)
  response.json({ "id": request.params.id });
};


export default {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getUser
}
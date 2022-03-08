const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-errors');
const User = require('../models/user');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'tony nguyen',
    email: 'hynguyen@gmail.com',
    password: 'test',
  },
  {
    id: 'u2',
    name: 'bao nguyen',
    email: 'hynguyen123@gmail.com',
    password: 'test',
  },
];

const getUsers = (req, res, next) => {
  res.json({ user: DUMMY_USERS });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifyUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifyUser || identifyUser.password !== password) {
    return next(new HttpError('Could not find user ', 401));
  }
  res.json({ message: 'logged in' });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError('Invalid email address', 422));
  }

  const { username, email, password, places } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Siging up fail, please try again later', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead',
      422
    );
    return next(error);
  }

  const createdUser = new User({
    username,
    email,
    userImage:
      'https://media.istockphoto.com/vectors/user-icon-flat-style-isolated-on-white-background-vector-id1084418050?k=20&m=1084418050&s=612x612&w=0&h=pm3Ov7GL8rnKKqe98FEfoya6A6UK-z4Iv60LPbj38GE=',
    password,
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError('Siging up fail', 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;

const { validationResult } = require('express-validator');
const cloudinary = require('../cloudinary');
const fs = require('fs');

const HttpError = require('../models/http-errors');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'fetching user fail, please try agian later',
      500
    );
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Siging up fail, please try again later', 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'invalid credentials, Could not log you in',
      401
    );
    return next(error);
  }

  res.json({
    message: 'logged in',
    user: existingUser.toObject({ getters: true }),
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid input, please check your data again', 422)
    );
  }

  const { username, email, password } = req.body;

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

  let uploader;
  try {
    uploader = await cloudinary.uploads(
      req.file.path,
      'Zootube-resources/images/users'
    );
    console.log('uploader', uploader);
  } catch (err) {
    console.log(err);
    return next(new HttpError('error when upload image', 500));
  } finally {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  const createdUser = new User({
    username,
    email,
    userImage: uploader.url,
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Siging up fail', 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;

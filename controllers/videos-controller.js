const { validationResult } = require('express-validator');

const HttpError = require('../models/http-errors');
const Video = require('../models/video');

const getVideos = async (req, res, next) => {
  let videos;
  try {
    videos = await Video.find();
  } catch (err) {
    const error = new HttpError(
      'Opps something went wrong could not get all places!!!',
      500
    );
    return next(error);
  }

  res.json({
    videos: videos.map((video) => video.toObject({ getters: true })),
  });
};

const getVideoById = async (req, res, next) => {
  const videoId = req.params.vid;

  let video;
  try {
    video = await Video.findById(videoId);
  } catch (err) {
    const error = new HttpError(
      'Some thing went wrong could not find place',
      500
    );
    return next(error);
  }

  if (!video) {
    const error = new HttpError(
      'Could not find a video for the provided id',
      404
    );
    return next(error);
  }

  res.json({
    video: video.toObject({ getters: true }),
  });
};

const getVideosByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userVideos;
  try {
    userVideos = await Video.find({ creatorId: userId });
  } catch (err) {
    const error = new HttpError('fetching data fail', 500);
  }

  if (!userVideos || userVideos.length === 0) {
    return next(
      new HttpError('Could not find videos for the provided user id', 404)
    );
  }

  res.json({
    userVideos: userVideos.map((video) => video.toObject({ getters: true })),
  });
};

const createVideo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid input, please check your input data', 422)
    );
  }
  const { title, description, creatorId } = req.body;

  //cái này mo phong lúc  uppload video lên s3 rồi lấy video url
  let resource = {
    imageUrl: 'imageUrl',
    videoUrl: 'videoUrl',
  };

  const createdVideo = new Video({
    title,
    description,
    resource,
    creatorId,
  });

  try {
    await createdVideo.save();
  } catch (err) {
    const error = new HttpError('creating video fail', 500);
    return next(error);
  }

  res.status(201).json({ video: createdVideo.toObject({ getters: true }) });
};

const updateVideo = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid input, please check your input data', 422)
    );
  }

  const { title, description } = req.body;
  const videoId = req.params.vid;

  let updatedVideo;
  try {
    updatedVideo = await Video.findById(videoId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place',
      500
    );
    return next(error);
  }

  updatedVideo.title = title;
  updatedVideo.description = description;

  try {
    await updatedVideo.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong,could not update place ',
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({ updatedVideo: updatedVideo.toObject({ getters: true }) });
};

const deleteVideo = async (req, res, next) => {
  const videoId = req.params.pid;

  try {
    await Video.findOneAndRemove(videoId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong could not delete place',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted Video' });
};

exports.getVideos = getVideos;
exports.getVideoById = getVideoById;
exports.getVideosByUserId = getVideosByUserId;
exports.createVideo = createVideo;
exports.updateVideo = updateVideo;
exports.deleteVideo = deleteVideo;

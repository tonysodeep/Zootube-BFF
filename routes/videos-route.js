const express = require('express');

const { check } = require('express-validator');

const videoController = require('../controllers/videos-controller');

const checkAuth = require('../middleware/check-auth');
const filesUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', videoController.getVideos);

router.get('/:vid', videoController.getVideoById);

router.use(checkAuth);

router.get('/user/:uid', videoController.getVideosByUserId);

router.post(
  '/',
  filesUpload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
    {
      name: 'video',
      maxCount: 1,
    },
  ]),
  [
    check('title').not().isEmpty().trim(),
    check('description').isLength({ min: 5 }).not().isEmpty().trim(),
  ],
  videoController.createVideo
);

router.patch(
  '/:vid',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }).not().isEmpty(),
  ],
  videoController.updateVideo
);

router.delete('/:vid', videoController.deleteVideo);

module.exports = router;

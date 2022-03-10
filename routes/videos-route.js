const express = require('express');

const { check } = require('express-validator');

const videoController = require('../controllers/videos-controller');

const router = express.Router();

/**
 * @swagger
 * /:
 *  get:
 *    description:  Get all video !
 *    response:
 *      200:
 *        description: Success!
 *    
 */
router.get('/', videoController.getVideos);

router.get('/:vid', videoController.getVideoById);

router.get('/user/:uid', videoController.getVideosByUserId);

router.post(
  '/',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }).not().isEmpty(),
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

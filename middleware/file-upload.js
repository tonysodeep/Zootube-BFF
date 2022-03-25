const multer = require('multer');

const { v4: uuidv4 } = require('uuid');

const MINE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};
const MINE_TYPE_MAP_VIDEO_UPLOAD = {
  ...MINE_TYPE_MAP,
  'video/mp4': 'mp4',
  'video/avchd': 'avchd',
  'video/mov': 'mov',
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
      const ext = MINE_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + '.' + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MINE_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  },
});

const filesUpload = multer({
  limits: 1000000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'image') {
        cb(null, 'uploads/images');
      } else {
        cb(null, 'uploads/videos');
      }
    },
    filename: (req, file, cb) => {
      const ext = MINE_TYPE_MAP_VIDEO_UPLOAD[file.mimetype];
      cb(null, uuidv4() + '.' + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MINE_TYPE_MAP_VIDEO_UPLOAD[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  },
});

exports.fileUpload = fileUpload;
exports.filesUpload = filesUpload;

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const videosRoute = require('./routes/videos-route');

const app = express();

app.use(bodyParser.json());

app.use('/api/videos', videosRoute);
// app.use('/api/users', userRoutes);

//send error cho route ko tìm thấy
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404);
  throw error;
});

//send error cho tất cả path mà error
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknow error orrcured!' });
});

mongoose
  .connect(
    'mongodb+srv://admin:tgof5569A@cluster0.ufvlg.mongodb.net/zootubeDatabase?retryWrites=true&w=majority'
  )
  .then(() => {
    app.listen(5069);
  })
  .catch((err) => {
    console.log(err);
  });

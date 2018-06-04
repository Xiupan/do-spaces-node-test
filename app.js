const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');

const app = express();

// set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint
})

// change bucket property to your Space name
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'ecotonetech',
    acl: 'public-read',
    key: function(request, file, callback) {
      console.log(file);
      callback(null, file.originalname);
    }
  })
}).array('upload', 1);

app.use(express.static('public'));

app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/index.html')
})

app.get('/success', function (req, res){
  res.sendFile(__dirname + '/public/success.html')
})

app.get('/error', function (req, res){
  res.sendFile(__dirname + '/public/error.html')
})

app.post('/upload', function(req, res, next){
  upload(req, res, function(error){
    if (error) {
      console.log(error);
      return res.redirect('/error')
    }
    console.log('File uploaded successfully!');
    res.redirect('/success')
  })
})

app.listen(3001, function() {
  console.log('Node server listening on port 3001.');
})

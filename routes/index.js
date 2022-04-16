var express = require('express');
var router = express.Router();
const exec = require('child_process');
const axios = require('axios');
const multer = require('multer');
var path = require('path')


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/real-time', function (req, res, next) {
  res.render('real-time', { title: 'Express' });
});

/* GET home page. */
router.get('/image', function (req, res, next) {
  res.render('image', { prediction: '' });
});

const uploadImage = multer({ dest: "uploads/" });
/* GET home page. */
router.post('/image', uploadImage.single("file"), function (req, res, next) {
  res.render('image', { predictions: '' });
});



const videoStorage = multer.diskStorage({
  destination: 'videos', // Destination to store video 
  filename: (req, file, cb) => {
    cb(null, path.extname(file.fieldname) + '_' + Date.now()
      + file.originalname)
  }
});

const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 10000000 // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    // upload only mp4 and mkv format
    if (!file.originalname.match(/\.(mp4|MPEG-4|mkv|mov)$/)) {
      return cb(new Error('Please upload a video'))
    }
    cb(undefined, true)
  }
});

router.get('/video', function (req, res, next) {
  res.render('video', { file: "" });
});

router.post('/video', videoUpload.single('video'), function (req, res, next) {
  const uploadedFile = req.file;
  var scriptPath = path.resolve(__dirname, './command.sh');
  var x = exec.exec("ROBOFLOW_KEY=9g5NZhFEMyDUaoecmn0N ./infer.sh project-jmfll/4 ../videos/video.mp4 ../output/output1.mp4 --fps_in 1", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

  res.render('video', { file: uploadedFile });
});

module.exports = router;

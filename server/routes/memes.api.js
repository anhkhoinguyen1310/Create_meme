var express = require('express');
var router = express.Router();

const {upload} = require("../middlewares/upload.helper");
const {resize, blur, writeTextOnImage} = require("../middlewares/photo.helper");
const {createMeme, getAllMemes} = require("../controllers/meme.controllers");
/* GET users listing. */
router.get('/', getAllMemes)
router.post('/', upload.single("image"), createMeme);

module.exports = router;

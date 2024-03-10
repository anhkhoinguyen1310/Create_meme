var express = require('express');
var router = express.Router();

const memeAPI = require("./memes.api");
router.use ("/memes", memeAPI);
module.exports = router;

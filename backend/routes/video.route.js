const express =  require('express');
const router = express.Router();
const validate = require("../middlewares/validate");
const getVideo = require("../validations/video.validation");
const {uploadVideo,fetchVideo,fetchVideoById,changeVotes,updateViews} = require("../controllers/video.controller");


//get routes for videos
router.get("/",fetchVideo);

router.get("/:videoId",fetchVideoById);


//console.log("in route");
router.post("/",uploadVideo);

router.patch("/:videoId/votes",changeVotes);

router.patch("/:videoId/views",updateViews);
//mongodb+srv://admin:pa55word@cluster0.wmoge.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
module.exports =  router;
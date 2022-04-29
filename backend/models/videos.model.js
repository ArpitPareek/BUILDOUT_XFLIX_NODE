const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
            votes:{
                upVotes:{
                    type:Number,
                    default:0
                },
                downVotes:{
                    type:Number,
                    default:0
                }
            },
            previewImage:{
                type:String,
                required:true
            },
            title:{
                type:String,
                required:true
            },
            genre:{
                type:String,
                required:true
            },
            contentRating:{
                type:String,
                required:true
            },
            releaseDate:{
                type:String,
                required:true
            },
            videoLink:{
                type:String,
                required:true
            },
            viewCount:{
                type:Number,
                default:0
            }
});

const Video = mongoose.model("Video",videoSchema);

module.exports = Video;

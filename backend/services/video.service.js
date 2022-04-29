const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Video = require("../models/videos.model");


const postVideos = async(videos)=>{
    console.log(videos)
    if(videos.length){
        try{
            //console.log("loging video in service",videos);
            const newVideo = await Video.insertMany(videos);
            console.log(newVideo)
            return newVideo
        }catch(err){
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,err.message)
        }
    }else if(videos.videos){
        try{
            //console.log("loging video in service",videos);
            const newVideo = await Video.create(videos);
            console.log(newVideo)
            return newVideo
        }catch(err){
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,err.message)
        }
    }else{
        try{
            console.log("loging video in service",videos);
           const newVideo = await Video.create({...videos});
           console.log(newVideo)
           return newVideo
        }catch(err){
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,err.message)
        }
    }
};

const getAllVideos = async() =>{
    const videos = await Video.find();
    return {"videos":videos};
}

const getAllVideosWithQuery = async() =>{
    const videos = await Video.find();
    //console.log(videos)
    return videos;
}

const getVideosById = async(videoId) =>{
    console.log(videoId);
    const video = await Video.findById(videoId);
    //console.log(video);
    return video;
};

const chnageVoteCount = async(body,videoId)=>{
        const data = await Video.findById(videoId);
        console.log(data)
        if(data==null){
            throw new ApiError(httpStatus.NOT_FOUND,"No video found with matching id")
        }
        else{
            if(body.vote == "downVote"){
                data.votes.downVotes++;
                data.save();
                console.log("in line 66",data)
            }if(body.vote == "upVote"){
                data.votes.upVotes++;
                data.save();
                console.log("in line 70",data)
            }
        }
};

const updateViewCount = async(videoId)=>{
    const data = await Video.findById(videoId);
    if(data==null){
        throw new ApiError(httpStatus.NOT_FOUND,"No video found with matching id")
    }else{
        data.viewCount++;
        data.save();
        console.log(data);
    }

};




module.exports = {
    postVideos,
    getAllVideos,
    getVideosById,
    getAllVideosWithQuery,
    chnageVoteCount,
    updateViewCount
}
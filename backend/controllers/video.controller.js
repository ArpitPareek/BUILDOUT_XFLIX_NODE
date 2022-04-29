const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { postVideos, getVideosById, getAllVideos, getAllVideosWithQuery,chnageVoteCount ,updateViewCount} = require("../services/video.service");

const uploadVideo = catchAsync(async (req, res) => {
    console.log("in video controller");
    const video = req.body;
    const newlyCreatedVideo = await postVideos(video);
    return res.status(201).json(newlyCreatedVideo);
});

const fetchVideo = catchAsync(async (req, res) => {
    try{
    if (Object.entries(req.query).length !== 0) {
        let { title, contentRating, sortBy, genres } = req.query;
        const List = await getAllVideosWithQuery();
        //res.status(200).json({"videos":List})
        if (genres) {
            genres = genres.split(",");
            let isGenreAvailable = false
            if (genres.length == 1) {
                let newList = List.filter((item) => {
                    if (item.genre == genres[0]) {
                        isGenreAvailable = true
                    } if (genres[0] == "All") {
                        isGenreAvailable = true
                        return item
                    }
                    return genres[0].toUpperCase() == item.genre.toUpperCase()
                });
                if (isGenreAvailable) {
                    return res.status(200).json({ "videos": newList });
                } else {
                    throw new ApiError(httpStatus.BAD_REQUEST, "genre must be one of [Education, Sports, Movies, Comedy, Lifestyle, All]")
                }
            } 
            if (genres.length > 1) {
                if (title && contentRating) {
                    let isContent = false;
                    console.log(isContent,"log")
                    //console.log("in line 39",title,contentRating,genres)
                    let newList = List.filter((item) => {
                       if (contentRating == "All" || contentRating=="all") {
                            isContent = true;
                            return (
                                (
                                    (item.genre == genres[0] || item.genre == genres[1]) && 
                                    (item.title.toLowerCase().includes(title.toLowerCase()))
                                )
                            );
                        }if(contentRating=="anyone" || contentRating=="Anyone"){
                            isContent = true;
                            return(
                                (
                                    (item.genre == genres[0] || item.genre == genres[1]) && 
                                    (item.title.toLowerCase().includes(title.toLowerCase())) &&
                                    (item.contentRating.toUpperCase()==contentRating.toUpperCase())
                                )
                            )
                        } if (contentRating.toUpperCase()==item.contentRating.toUpperCase()){
                            //console.log(item.genre,genres[0],genres[1],item.title.toUpperCase(),item.contentRating);
                            //console.log(item.contentRating,parseInt(item.contentRating))
                            isContent = true;
                            console.log((item.genre == genres[0] || item.genre == genres[1]),"in line 64");
                            console.log((parseInt(item.contentRating) <= parseInt(contentRating) || item.contentRating.toUpperCase()==contentRating),"in line 65");
                            console.log((item.title.toUpperCase().includes(title.toUpperCase())),"in line 66");
                            return (
                                (item.genre == genres[0] || item.genre == genres[1]) &&
                                (parseInt(item.contentRating) <= parseInt(contentRating) || item.contentRating.toUpperCase()==contentRating) &&
                                (item.title.toUpperCase().includes(title.toUpperCase()))
                            )
                        }
                    })
                    console.log(newList)
                    if (isContent) {
                       return res.status(200).json({ "videos": newList })
                    } if (isContent == false) {
                       return  res.status(400).json({ "message": "Invalid content rating" })
                    }
                }
                //  if (parseInt(item.contentRating) <= parseInt(contentRating) || item.contentRating == "anyone" || item.contentRating == "Anyone" ) {
                //     isContent = true
                //     let newList = List.filter((item) => {
                //         return (genres[0] == item.genre || genres[1] == item.genre)
                //     });
                //     res.status(200).json({ "videos": newList })
                // }
            }
            if(!title && !contentRating){
                let newList = List.filter((item) => {
                    if (item.genre == genres[0] || item.genre == genres[1]) {
                        isGenreAvailable = true
                    } if (genres[0] == "All") {
                        isGenreAvailable = true
                        return item
                    }
                    return (genres[0].toUpperCase() == item.genre.toUpperCase() || genres[1].toUpperCase() == item.genre.toUpperCase())
                });
                if (isGenreAvailable) {
                    return res.status(200).json({ "videos": newList });
                } else {
                    throw new ApiError(httpStatus.BAD_REQUEST, "genre must be one of [Education, Sports, Movies, Comedy, Lifestyle, All]")
                }
            }
        } if (contentRating) {
            let isContent = false;
            let contentString = ["Anyone", "7+", "12+", "16+", "18+", "All"];
            let newList = List.filter((item) => {
                if (contentRating == item.contentRating) {
                    isContent = true
                } if (contentRating == "All" || contentRating == "all") {
                    isContent = true;
                    return List
                } if (contentRating == "anyone" || contentRating == "Anyone") {
                    isContent = true
                    return (
                        item.contentRating.toUpperCase() == contentRating.toUpperCase()
                    )
                }
                if (contentRating.toUpperCase()==item.contentRating.toUpperCase()) {
                    console.log("100")
                    isContent = true
                
                return (
                    (parseInt(item.contentRating) <= parseInt(contentRating)||item.contentRating=="anyone"||item.contentRating=="Anyone"))
            }})
            if (isContent) {
                res.status(200).json({ "videos": newList })
            } if (isContent == false) {
                res.status(400).json({ "message": "Invalid content rating" })
                // throw new ApiError(httpStatus.BAD_REQUEST,"Invalid content rating");
            }
        } if (sortBy) {
            if (sortBy == "ViewCount") {
                List.sort((a, b) => b.viewCount - a.viewCount);
                res.status(200).json({ "videos": List })
            } if (sortBy == "releaseDate") {
                List.sort((a, b) => Date.parse(b.releaseDate) - Date.parse(a.releaseDate));
                res.status(200).json({ "videos": List })
            } else {
                throw new ApiError(httpStatus.BAD_REQUEST, "sortBy must be one of [viewCount, releaseDate]")
            }
        } if (title) {
            let newList = List.filter((item) => {
                return (item.title.toUpperCase().includes(title.toUpperCase()))
            });
            res.status(200).json({ "videos": newList });
        }
    } else {
        const allVideos = await getAllVideos();
        res.status(200).send(allVideos)
    }
}catch(err){
    res.status(500).json({"message":err.message})
}
})

const fetchVideoById = catchAsync(async (req, res) => {
    if (!req.params.videoId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "must be a valid mongoID")
    }
    const data = await getVideosById(req.params.videoId);
    if (!data) {
        throw new ApiError(httpStatus.NOT_FOUND, "No video found with matching id")
    }
    res.send(data);
});

const changeVotes = catchAsync(async(req,res)=>{
    
        if (!req.params.videoId.match(/^[0-9a-fA-F]{24}$/)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "must be a valid mongoID")
        }
        console.log(req.body,req.params.videoId)
        await chnageVoteCount(req.body,req.params.videoId);
        res.status(204).send();
});

const updateViews = catchAsync(async(req,res)=>{
    if (!req.params.videoId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "must be a valid mongoID")
    }
    await updateViewCount(req.params.videoId);
    res.status(204).send();
});

module.exports = {
    uploadVideo,
    fetchVideo,
    fetchVideoById,
    changeVotes,
    updateViews
};
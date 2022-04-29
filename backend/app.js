const express = require("express");
const cors = require("cors");
const httpStatus = require("http-status");
const { errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");

const routes = require("./routes/video.route");


const app = express();

// parse json request body
app.use(express.json());

app.use("/v1/videos",routes);

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options("*", cors());

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorHandler);



module.exports = app;
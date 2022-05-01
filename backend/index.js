const mongoose = require("mongoose");
const app = require("./app");
const {NODE_ENV,MONGODB_URL} = require("../config");


mongoose.connect(MONGODB_URL,{ useNewUrlParser: true })
        .then(()=>console.log("connected to mongo "))
        .catch((e)=>console.log("error",e));

let server = app.listen(NODE_ENV,()=>console.log("server is listening at",NODE_ENV));
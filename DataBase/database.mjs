import mongoose from "mongoose";
import { mongodburl } from "../DataBase/urls.mjs"
mongoose.connect(mongodburl, { useNewUrlParser: true, useUnifiedTopology: true });


const collection = mongoose.model("uploads", {
    // audioname: String,
    // audiofilepath: String,
    // imagefilepath: String,
    // rawaudioname: String,
    // rawimagename: String
    name:{
        type:String,
        unique:true
    },
    thumbnail:String,
    data:Array

});

const adminpaneldb = mongoose.model("admin", {
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },token: {
        type: String,
    },
})

const usersdata = mongoose.model("users", {
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },token: {
        type: String,
    },
})

export { collection,adminpaneldb, usersdata};
import express from "express";
const routes = express();
import {insertdata, getalldata,deletedata,adminpanel, deletecategories} from "../controller/adminpanel.mjs";
import {insertusers,login,updateusers,deleteusers,searchdata} from "../controller/users.mjs"

//sending uploading data to server from admin App
routes.post("/",insertdata)
routes.get("",getalldata)
routes.delete("",deletedata)

// delete categories from server database
routes.delete("/deletecategories",deletecategories)

//search audios
routes.post("/search",searchdata);

// Admin app login details
routes.post("/admin",adminpanel)

// Users authentication details
routes.post("/users",insertusers)
routes.post("/users/login",login)
routes.put("/users",updateusers)
routes.delete("/users",deleteusers)


export {routes};
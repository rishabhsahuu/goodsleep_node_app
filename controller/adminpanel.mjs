export { insertdata, getalldata, deletedata, adminpanel }
import { audio } from "../middleware/uploadsaudio.mjs"
import { collection, adminpaneldb, usersdata } from "../DataBase/database.mjs";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import { jwtkey } from "../DataBase/urls.mjs"

const insertdata = (req, res, next) => {
    audio(req, res, async (error) => {
        if (error) {
            next(error);
        } else {
            const { audioname, categories, where, name } = req.body;
            // This is for full url 
            // const url = req.protocol + "://" + req.get("host");

            // This is for testing perpose only
            const url = req.protocol + "://" + "192.168.2.117:8000" ;


            const audiopathoffile = where == "uploads" ? "/" + req.files["audiofilepath"][0]["path"].replace(/\\/g, "/") : "";
            const imagepathoffile = where == "uploads" ? "/" + req.files["imagefilepath"][0]["path"].replace(/\\/g, "/") : "";
            const categoriespathoffile = where == "categories" ? "/" + req.files["thumbnail"][0]["path"].replace(/\\/g, "/") : "";


           
            if (where == "categories") {
                collection.insertMany([{
                    "name": name,
                    "thumbnail": url + categoriespathoffile,
                    "data": []

                }],(error,data)=>{
                    if (error) {
                        
                        res.send([{
                            'error': "insertdata error"
                        }]);
                    } else if (data.length <=0) {
                        res.send([{
                            'error':"unable to insert data to database"
                        }]);
                        
                    }else{
                        res.send([{
                            "data":"categories updated"
                        }])
                    }
                });
            } else if (where == "uploads") {
                collection.updateOne({"name": categories},{
                    $push:{
                        "data":{
                            "audioname": audioname,
                                "audiofilepath": audiopathoffile != "" ? url + audiopathoffile : "",
                                "imagefilepath": imagepathoffile != "" ? url + imagepathoffile : "",
                                "rawaudioname": path.basename(audiopathoffile),
                                "rawimagename": path.basename(imagepathoffile),
                                "categories":categories

                        }
                    }
                },(error,data)=>{
                    if (error) {
                        res.send([{
                            "error":"updateOne error"
                        }])
                    } else if(data.length <=0){
                        res.send([{
                            "error": "update one data not comming"
                        }])
                    }else{
                        res.send([{
                            "data":"file uploaded succesfully"
                        }])
                    }
                });
            }


            // if (where == "categories") {

            //     collection.updateOne({ token: "token" }, {
            //         $push: {
            //             "categories": { "name": name, "categoriespic": categoriespathoffile != undefined ? url + categoriespathoffile : "" }
            //         }
            //     }, (error, data) => {
            //         if (error) {
            //             res.send([{ 'error': "categories update error" }])
            //         } else if (data["acknowledged"] == true) {
            //             res.send({
            //                 "upload": true
            //             });
            //         } else { res.send(data); }
            //     })

            // }
            // else if (where == "uploads") {
            //     collection.updateOne({ token: "token" },
            //         {
            //             $push: {
            //                 [categories]: {
                                // "audioname": audioname,
                                // "audiofilepath": audiopathoffile != "" ? url + audiopathoffile : "",
                                // "imagefilepath": imagepathoffile != "" ? url + imagepathoffile : "",
                                // "rawaudioname": path.basename(audiopathoffile),
                                // "rawimagename": path.basename(imagepathoffile)
            //                     , "categories": categories
            //                 }
            //             }

            //         },
            //         (error, data) => {
            //             if (error) {
            //                 res.send(error);
            //             } else {

            //                 res.send(`${categories} lsit is updated`);
            //             }
            //         }
            //     );
            // }






        }
    });
};

const getalldata = async (req, res) => {
     collection.find((error, data) => {
        if (error) {
            res.send("error while calling data from database")
        } else {
            res.send(data);
        }
    });

}






const deletedata = async (req, res) => {
    const { rawaudioname, rawimagename, categories } = req.body;
    // console.log(rawaudioname);
    // const data = await collection.findByIdAndDelete(id);
    const audiofilepath = "./audios/" + rawaudioname;
    const imagefilepath = "./images/" + rawimagename;

   
         collection.updateOne({ "name": categories }, {
            $pull:
            {
                "data": {
                    "rawaudioname": rawaudioname
                }

            }
        },
            (error, result) => {
                if (error) {
                    res.send(error);
                } else {

                    fs.unlink(audiofilepath, (req, res) => {
                        console.log("audio deleted");
                    });

                    fs.unlink(imagefilepath, (req, res) => {
                        console.log(" image deleted");
                    });

                    res.send("This audio is deleted");
                }
            }
        )

    


};
const adminpanel = async (req, res) => {
    const { email } = req.body;
    const result = await adminpaneldb.find(req.body);

    if (result.length <= 0) {
        res.send([{
            token: "",
            authentication: false
        }])
    } else {
        jwt.sign(
            { email },
            jwtkey,
            async (error, data) => {
                if (error) {
                    res.send([{
                        token: "",
                        authentication: false
                    }])
                } else {

                    const auth = await adminpaneldb.updateOne({ "email": email }, { "token": data });
                    console.log(auth);
                    res.send([{
                        token: data,
                        authentication: true
                    }])

                }
            }
        )
    }

};





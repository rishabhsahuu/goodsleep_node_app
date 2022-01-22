import { collection, usersdata } from "../DataBase/database.mjs";
import vaildator from "email-validator";
import bcrypt, { hash } from "bcrypt";
import { jwtkey } from "../DataBase/urls.mjs";
import jwt from "jsonwebtoken";

const insertusers = (req, res) => {
    const { email, password } = req.body;
    const vaildate = vaildator.validate(email);

    if (!vaildate) {
        res.send("Email is not Vaild");
    } else {
        bcrypt.hash(password, 12, async (error, hash) => {
            if (error) {
                res.send("bcrpty error")
            } else {
                await usersdata.insertMany([{
                    "email": email,
                    "password": hash,
                    "token": ""
                }], (error, user) => {
                    if (error) {
                        res.send("account is already created");
                    } else {

                        res.send("Account Created Successfully");
                    }
                });
            }

        })
    }
}

const login = (req, res) => {
    const { email, password } = req.body;
    console.log("req");
    usersdata.findOne({ "email": email }, (error, userdata) => {
        if (userdata == undefined) {
            res.send([{
                "Authentication": false,
                "error": "User not found"
            }]);
        } else {
            bcrypt.compare(password, userdata.password, (error, result) => {
                if (error) {
                    res.send([{
                        "Authentication": false,
                        "error": "bcrypt error"
                    }]);
                } else if (result) {
                    jwt.sign(
                        { email },
                        jwtkey,
                        async (error, token) => {
                            if (error) {
                                res.send([{
                                    "Authentication": false,
                                    "error": "jwt error"
                                }])
                            } else {
                                usersdata.updateOne({ "email": userdata.email }, { "token": token }, (error, data) => {
                                    if (error) {
                                        res.send([{
                                            "Authentication": false,
                                            "error": "token not updated to database"
                                        }])
                                    } else {
                                        res.send([{
                                            "Authentication": true,
                                            "token": token
                                        }])
                                    }
                                });
                            }
                        }
                    );
                } else {
                    res.send(
                        [{
                            "Authentication": false,
                            "error": "Wrong Password"
                        }]
                    );
                }
            });
        }


    });
};
const updateusers = (req, res) => {
    const { token, email, newpassword, oldpassword } = req.body;
    // console.log(oldpassword);
    // console.log(email);
    // console.log(token);
    if (email != "") {
        // console.log("start");
        const vaildate = vaildator.validate(email)

        // console.log(data);
        if (!vaildate) {
            res.send("email is not vaild");
        } else if (vaildate) {
            usersdata.updateOne({ "token": token }, { "email": email }, (error, data) => {
                // console.log(data);
                if (error) {
                    res.send("email update error")
                } else {
                    res.send("Email has changed");
                }
            });
        }

    } else if (oldpassword != "") {
        usersdata.find({ "token": token }, (error, data) => {
            // console.log(data);
            if (error) {
                return Error(error);
            } else if (data != undefined) {
                bcrypt.compare(oldpassword, data[0].password, (error, result) => {
                    //    console.log(data[0].password);
                    if (error) {
                        res.send(error);
                    } else if (result) {
                        bcrypt.hash(newpassword, 12, async (error, hash) => {
                            if (error) {
                                res.send(error);
                            } else {
                                await usersdata.updateOne({ "token": token }, { "password": hash }, (error, data) => {
                                    if (error) {
                                        res.send(error);
                                    } else {
                                        res.send(data);
                                    }
                                }).clone();
                            }
                        });

                    } else {
                        res.send("Wrong password");
                    }
                });
            } else {
                res.s
            }
        });

    }
}
const deleteusers = (req, res) => {
    const { id } = req.body;
    usersdata.findByIdAndDelete(id, (error, data) => {
        console.log(data);
        if (error) {
            res.send(error);
        } else if (id != null) {
            res.send("account has deleted");
        } else {
            res.send("error occurs");
        }
    });
}

const searchdata = (req, res) => {
    const { search } = req.body;
    // {"data.audioname" :search},{data: 1}
    collection.aggregate([{$unwind: "$data"},{$match : {"data.audioname": search}},{$group : {_id:"$data"}}

    ], (error, data) => {
        if (error) {
            // res.send([{
            //     "error":"search error"
            // }])
            res.send(error);
        } else {
            if (data <= 0) {
                res.send([{
                    "error": "no search result"
                }])
            } else {
                res.send(data);
            }
        }
    })
};

export { insertusers, updateusers, deleteusers, login, searchdata }
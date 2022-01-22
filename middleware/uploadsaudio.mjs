import path from "path";
import multer from "multer";


const audiosstorage = multer.diskStorage(
{
    destination : (req,file,cb)=>{
        // cb(null,"./audios");
        const audioext = [".mp3",".wav",".aac"];
        const imageext = [".png",".jpg",".jpeg"];
        if (audioext.includes(path.extname(file.originalname))) {
            cb(null,"./audios");
        }else if (imageext.includes(path.extname(file.originalname))){
            cb(null,"./images");
        }
    },
    filename (req,file,callback){
        callback(null, Date.now() + "-" + file.originalname);
    }
}
);

const audiosfliefilter = (req,file,callback)=>{

    const validext = [".mp3",".aac",".wave"];

    if (!validext.includes(path.extname(file.originalname))) {
        return callback(new Error("Upload These formats only mp3,wave or aac"));        
    }       
    
    const filesize = parseInt(req.headers["content-length"]);

    if(filesize > 20000000){
        return callback(new Error("Size of a file is too high upload minimum 20MB file"));
    };

    callback(null, true);
};

const audios = multer({storage : audiosstorage,
    // fileFilter : audiosfliefilter,
    // filesize : 20000000
});




const audio = audios.fields([{name: "imagefilepath" ,maxCount : 1},{name: "audiofilepath" ,maxCount : 1},{name: "thumbnail",maxCount : 1}])

export {audio};

// single(["audiofilepath"]);
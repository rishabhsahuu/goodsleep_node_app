import express from "express";
const app = express();
import cors from "cors";
import {routes} from "./routes/routes.mjs"

app.use('/audios', express.static("audios"));
app.use("/images", express.static("images"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use("", routes);

app.listen(process.env.PORT || 8000,()=>{
    console.log('Ready to GO!');
})
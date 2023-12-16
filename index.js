//main server 
// no i will not overthink while making this project
//jasari ni garxu garxu

import  express  from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

//application related configuration
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({
    extended: true
  }));
  app.use(express.json());

app.get('/' , (req , res) => {
    res.render("app");
})

app.post('/summerize' , async (req , res) => {
    let viedoUrl = req.body.viedoUrl;

    if(viedoUrl === undefined || viedoUrl === '' || viedoUrl === null ){
        return res.render('app', {validFlag : false , message : "please enter valid video URL"})
    } else {
        //hit an api endpoint
        const options = {
            method: 'GET',
            url: 'https://youtube-summarizer-by-chatgpt.p.rapidapi.com/ytsummary1/',
            params: {
              url: `${viedoUrl}`,
              key: process.env.GPT_KEY
            },
            headers: {
              'X-RapidAPI-Key': process.env.API_KEY,
              'X-RapidAPI-Host': process.env.API_HOST
            }
          };
          
          try {
              const response = await axios.request(options);
            //   console.log(response.data.summary);
            if (response) {
                res.render("app", {validFlag : true , summerizeText : response.data.summary});
            }
          } catch (error) {
                res.render("app" , {validFlag : false ,summerizeText : "Provided viedo does not have transcripts" })
          }
    }
})

app.listen(PORT , () => {
    console.log("Server running");
})

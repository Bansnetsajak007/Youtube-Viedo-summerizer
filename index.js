import  express  from "express";
import dotenv from "dotenv";
import axios from "axios";
import { getSubtitles } from 'youtube-captions-scraper';

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

const getVideoId = (videoUrl)=> {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const match = videoUrl.match(regex);

const result = match && match[1];

return result;

}


const extractText = async (viedoId) => {
  try {
  const captions = await getSubtitles({
      videoID: `${viedoId}`, // youtube video id
          lang: 'en' // default: `en`
        })
        const concatenatedText = captions.reduce((acc , current) => {
          return acc + current.text;
        })
        return concatenatedText;
  } catch (error) {
      console.log(error.meessage);
  }
}


//extract videoId form URL ---> using regex patterns
app.post('/summerize' , async (req , res) => {
  let url = req.body.viedoUrl;
  // if(!url)  return res.status(400).json({ error: "Video URL is missing in the request body." });
  if(url === undefined || url === '' || url === null ){
    return res.render('app', {validFlag : false , message : "please enter valid video URL"})
  } else {
    //hit an api endpoint
    
        let viedoId = getVideoId(url);
        // console.log("ID: ",viedoId);
        const text = await extractText(viedoId);
        // console.log("text: ",text);

        const options = {
            method: 'POST',
            url: 'https://gpt-summarization.p.rapidapi.com/summarize',
            headers: {
              'content-type': 'application/json',
              'X-RapidAPI-Key': process.env.API_KEY,
              'X-RapidAPI-Host': process.env.API_HOST
            },
            data: {
              text: `${text}`,
              num_sentences: 30
            }
          };
          
          try {
            const response = await axios.request(options);
            // console.log("response",response);
            if(response) {
              res.render("app", {validFlag : true , summerizeText : response.data.summary});
            }
          } catch (error) {
            res.render("app" , {validFlag : false ,summerizeText : "Provided viedo does not have transcripts" })
          }
          };
          

    }
)

app.listen(PORT , () => {
    console.log("Server running");
})

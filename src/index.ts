import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import express, { Request, Response } from "express"
import { getTranscript } from "./utils/getTranscript"
import { split } from "./utils/split"
import { summarizer } from "./utils/summarizer"
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(cors())

interface SummarizeRequest extends Request {
  query: {
    url: string
  }
}
app.post("/summarize", async (req: SummarizeRequest, res: Response) => {
  const { url } = req.query
  //Validar URL do youtube
  const regex =
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/g
    if (!url || !regex.test(url)){
       //return res.status(400).send({ error: "Invalid YouTube URL" })
       retornar(res.status(400).send({ error: "Invalid YouTube URL" }))
    }else{
        //Busca legenda do YT
        const transcript = await getTranscript(url)

        //Enviar ao chat GPT
        const chunks = split(transcript)
        const {summary, topics} = await summarizer(chunks)

        //return res.send({summary, topics})
        retornar(res.send({summary, topics}))
    }
})

function retornar(res: Response){
  console.log(res)
  return res;
 }

app.listen(port, () => {
  console.log(` server is runnig on port ${port}`)
})

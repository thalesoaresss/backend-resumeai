"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const getTranscript_1 = require("./utils/getTranscript");
const split_1 = require("./utils/split");
const summarizer_1 = require("./utils/summarizer");
require('dotenv').config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.post("/summarize", async (req, res) => {
    const { url } = req.query;
    //Validar URL do youtube
    const regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/g;
    if (!url || !regex.test(url)) {
        //return res.status(400).send({ error: "Invalid YouTube URL" })
        retornar(res.status(400).send({ error: "Invalid YouTube URL" }));
    }
    else {
        //Busca legenda do YT
        const transcript = await (0, getTranscript_1.getTranscript)(url);
        //Enviar ao chat GPT
        const chunks = (0, split_1.split)(transcript);
        const { summary, topics } = await (0, summarizer_1.summarizer)(chunks);
        //return res.send({summary, topics})
        retornar(res.send({ summary, topics }));
    }
});
function retornar(res) {
    console.log(res);
    return res;
}
app.listen(port, () => {
    console.log(` server is runnig on port ${port}`);
});

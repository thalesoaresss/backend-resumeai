"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizer = summarizer;
const openai_1 = __importDefault(require("openai"));
require('dotenv').config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.openai.com/v1",
});
async function summarizer(chunks) {
    var _a, _b, _c, _d;
    let summaries = [];
    for (const chunk of chunks) {
        const summarizeResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Isso é uma transcrição de um vídeo do YouTube.",
                },
                {
                    role: "user",
                    content: `Se estiver em outro idioma traduza para pt-BR e resuma detalhadamente isso para um aluno do segundo grau: ${chunk}`,
                },
            ],
            "temperature": 0.7
        });
        summaries = [...summaries, (_b = (_a = summarizeResponse.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content,];
    }
    const consolidateResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "Isso é um resumo de um vídeo do YouTube.",
            },
            {
                role: "user",
                content: `Consolide o resumo abaixo no formato JSON usando a chave summary e consolide em 3 principais tópicos mais importantes do vídeo na chave topics:\n${summaries.join("\n")}`,
            },
        ],
    });
    const rawResponse = (_d = (_c = consolidateResponse.choices[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content;
    const cleanedResponse = rawResponse.replace(/```json|```/g, "").trim();
    const summaryConsolidated = JSON.parse(cleanedResponse);
    return {
        summary: summaryConsolidated === null || summaryConsolidated === void 0 ? void 0 : summaryConsolidated.summary,
        topics: summaryConsolidated === null || summaryConsolidated === void 0 ? void 0 : summaryConsolidated.topics,
    };
}

import OpenAI from "openai";
require('dotenv').config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.openai.com/v1",
});

export async function summarizer(chunks: string []): Promise<{ summary: string[]; topics: string[] }>{
  let summaries: string[] = []

  for(const chunk of chunks){
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
    })
    summaries = [... summaries, summarizeResponse.choices[0]?.message?.content as string,]
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
        content: `Consolide o resumo abaixo no formato JSON usando a chave summary e consolide em 3 principais tópicos mais importantes do vídeo na chave topics:\n${summaries.join(
          "\n"
        )}`,
      },
    ],
  })
  const rawResponse = consolidateResponse.choices[0]?.message?.content as string;
  const cleanedResponse = rawResponse.replace(/```json|```/g, "").trim();

  const summaryConsolidated = JSON.parse(cleanedResponse);
  return {
    summary: summaryConsolidated?.summary,
    topics: summaryConsolidated?.topics,
  }
}

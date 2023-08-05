import { EMOTIONS } from "../constants";
import { Configuration, OpenAIApi } from "openai";
import fs from "fs";

const FILE_NAME = "./src/data/emotionEmbeddings.json";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const emotionEmbeddings = await openai.createEmbedding({
  model: "text-embedding-ada-002",
  input: Object.values(EMOTIONS),
});

const data = emotionEmbeddings.data.data.reduce((acc, d, i) => {
  const emotion = Object.keys(EMOTIONS)[i];
  acc[emotion] = d.embedding;
  return acc;
}, {} as Record<string, number[]>);

fs.writeFile(FILE_NAME, JSON.stringify(data), (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(FILE_NAME, "has been written successfully");
  }
});

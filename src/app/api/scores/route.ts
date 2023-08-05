import { SimilarityScores } from "@/types";
import { dot } from "mathjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import words from "@/data/words.json";
import emotionEmbeddings from "@/data/emotionEmbeddings.json";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

type Body = {
  inputs: string[];
};

export async function POST(request: Request) {
  let { inputs }: Body = await request.json();

  if (inputs == null || inputs.length === 0) {
    inputs = [words[Math.floor(Math.random() * words.length)]];
  }

  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: inputs,
  });

  const scores: SimilarityScores = {};

  inputs.forEach((input, i) => {
    scores[input] = {};
    let emotionKeys = Object.keys(emotionEmbeddings);

    for (let emotion of emotionKeys) {
      scores[input][emotion] = dot(
        embeddingResponse.data.data[i].embedding,
        emotionEmbeddings[emotion as keyof typeof emotionEmbeddings]
      );
    }
  });

  return NextResponse.json(scores);
}

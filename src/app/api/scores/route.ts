import { SimilarityScores } from "@/types";
import { dot } from "mathjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import words from "@/words.json";
import { EMOTIONS } from "@/constants";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

type Body = {
  inputs: string[];
  labels: string[];
};

export async function POST(request: Request) {
  let { inputs, labels }: Body = await request.json();

  if (inputs == null || inputs.length === 0) {
    inputs = [words[Math.floor(Math.random() * words.length)]];
  }

  const inputsResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: inputs,
  });

  const labelsResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: Object.values(EMOTIONS),
  });

  const scores: SimilarityScores = {};

  inputs.forEach((input, i) => {
    scores[input] = {};
    labels.forEach((label, j) => {
      scores[input][label] = dot(
        inputsResponse.data.data[i].embedding,
        labelsResponse.data.data[j].embedding
      );
    });
  });

  return NextResponse.json(scores);
}

import { dot } from "mathjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const COLORS: string[] = [
  // primary
  "red",
  "yellow",
  "blue",
  // secondary
  "green",
  "purple",
  "orange",
  // neutrals
  "black",
  "white",
  "gray",
  // other common ones
  "pink",
  "brown",
];

export async function POST(request: Request) {
  const body = await request.text();

  const { data } = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: [body, ...COLORS],
  });

  const embeddings = data.data.map((d) => d.embedding);

  const colorScores = {
    ...Object.fromEntries(
      COLORS.map((color, index) => [
        color,
        dot(embeddings[0], embeddings[index + 1]),
      ])
    ),
  };

  return NextResponse.json(colorScores);
}

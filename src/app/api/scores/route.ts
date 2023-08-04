import { SimilarityScores } from "@/types";
import { dot } from "mathjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

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

  if (labels == null || labels.length === 0) {
    // autogenerate labels

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `score these inputs, pick the dimensions yourself. \ninputs: ${inputs.join(
            ", "
          )}`,
        },
      ],
      functions: [
        {
          name: "score",
          description:
            "Score inputs across dimensions. Come up with a list of helpful dimensions to score across. Pick at least 4 of them.",
          parameters: {
            type: "object",
            properties: {
              inputs: {
                type: "array",
                items: {
                  type: "array",
                  description: "The inputs to score",
                  items: {
                    type: "string",
                  },
                },
              },
              dimensions: {
                type: "array",
                description: "The dimensions to score across",
                items: {
                  type: "string",
                  items: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      ],
      function_call: { name: "score" },
    });

    const args = JSON.parse(
      response.data.choices[0].message?.function_call?.arguments!
    );

    labels = args["dimensions"];
  }

  console.log("inputs", inputs);
  console.log("labels", labels);

  const inputsResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: inputs,
  });

  const labelsResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: labels,
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

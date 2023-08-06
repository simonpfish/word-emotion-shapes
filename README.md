# Word Emotion Shapes

This project visualizes the emotional connotation of words using embeddings.

For a given word, we calculate the cosine distance to each emotion (represented by an emoji and description), and use this data to create a Catmull-Rom curve.

- We use [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings) to calculate the semantic similarities. You can find the relevant code in [api/scores/route.ts](./src/app/api/scores/route.ts).
- Visualization and animations are powered by [Nivo](https://nivo.rocks/radar/).

## Developing

This is a [Next.js](https://nextjs.org/) project, bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

To start developing, run:

```bash
npm run dev
```

## Resources

For more information, see:

- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Next.js Documentation](https://nextjs.org/docs)

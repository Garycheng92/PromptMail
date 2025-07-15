import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.responses.create({
  prompt: {
    "id": "pmpt_6871a11f16d08194b371b0ea9cfe79140092b39df4f550c3",
    "version": "2"
  },
  input: [],
  reasoning: {},
  max_output_tokens: 2048,
  store: true
});
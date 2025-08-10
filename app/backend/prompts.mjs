// backend/prompts.mjs
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Lazy init: backend wont crash if no key is present. it will only throw when used. I need this to test the contact us page messaging functionality
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim()) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY.trim(),
  });
}

const PROMPT_TONES = {
  summary: {
    id: "pmpt_6871a11f16d08194b371b0ea9cfe79140092b39df4f550c3",
    version: "2",
  },
  satirical: {
    id: "pmpt_68759ad666ac819083513b39d6e2344e0a41a02080f4e12f",
    version: "3",
  },
  punny: {
    id: "pmpt_68759b587b2081938fdebc84e26917f90ce47115c8fe0765",
    version: "2",
  },
  casual: {
    id: "pmpt_68759beadb2c819085421ce0233a323d0fd549d50f4b0438",
    version: "2",
  },
  formal: {
    id: "pmpt_68759bd351348190b3598d91dd533e7308e06dd146130238",
    version: "2",
  },
  oldEnglish: {
    id: "pmpt_68759b96852881948c46aa73dadf0c490d3bf61a11fd92333",
    version: "2",
  },
  teenspeak: {
    id: "pmpt_68759b7b97f881969bbee5fcf30c576d0a52967ab50b1a62",
    version: "2",
  },
};

export const prompt = async (text, tone) => {
  if (!openai) {
    // Don’t crash the server at startup; return a clear error only when route is used
    throw new Error("OPENAI_API_KEY is not set on the server.");
  }

  const meta = PROMPT_TONES[tone];
  if (!meta) {
    throw new Error(`Unknown tone '${tone}'.`);
  }

  const response = await openai.responses.create({
    prompt: { id: meta.id, version: meta.version },
    input: [{ role: "user", content: text }],
    max_output_tokens: 2048,
  });

  return response.output_text;
};

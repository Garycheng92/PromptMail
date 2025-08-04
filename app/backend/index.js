// backend/index.js
import { prompt } from "./prompts.mjs";
import cors from "cors";
import express from "express";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/api/prompt", async (req, res) => {
  const { text, tone } = req.body;
  try {
    const result = await prompt(text, tone);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
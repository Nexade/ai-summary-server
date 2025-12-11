import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Load environment variables (Railway injects them automatically)
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate-insights", async (req, res) => {
  try {
    const { reviews } = req.body;

    const completion = await client.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that reads Google reviews and makes a summary.",
        },
        {
          role: "user",
          content: `Here are some reviews:\n\n${reviews}\n\nPlease summarise the main insights following this exact format using 2–5 small points separated by semicolons:\n\nOverall sentiment: Example Point; Example Point; Positive Highlights: Example Point; Example Point; Negatives: Example Point; Example Point; Steps to Improve: Example Point; Example Point;`,
        },
      ],
    });

    res.json({ output: completion.choices[0].message.content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// ----- IMPORTANT: Express server for Railway -----
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

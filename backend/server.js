import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
console.log("API KEY:", process.env.GEMINI_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

app.post("/analyze", async (req, res) => {
  try {
    const { resumeText } = req.body;

    const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

    const prompt = `
Analyze this resume and provide:

1. Strengths
2. Weaknesses
3. Missing skills
4. ATS improvement tips

Resume:
${resumeText}
`;

    const result = await model.generateContent(prompt);

    res.json({
      feedback: result.response.text(),
    });
  } catch (error) {
  console.error("FULL ERROR:", error);

  res.status(500).json({
    error: error.message,
  });
    }

});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
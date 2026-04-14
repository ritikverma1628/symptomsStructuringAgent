import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

const PROMPT = `You are a medical assistant AI.
Extract structured data from patient symptoms.

Rules:
- Do NOT give medical advice
- Do NOT hallucinate unknown data
- Keep output STRICT JSON
- Extract only what is present or logically inferred

Fields:
- symptoms: list of symptoms
- duration: how long symptoms exist
- severity: low, medium, high
- possible_conditions: possible non-diagnostic conditions
- priority: low, medium, high
- summary: concise medical summary

Return valid JSON strictly following this schema:
{
  "symptoms": ["string"],
  "duration": "string",
  "severity": "low | medium | high",
  "possible_conditions": ["string"],
  "priority": "low | medium | high",
  "summary": "string"
}`;

app.post('/api/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Text input is required' });
    }

    if (text.length > 2000) {
      return res.status(400).json({ success: false, message: 'Text input is too long' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Mocked response if no real key is provided
      console.log('No Gemini API Key found, returning mock data.');
      // Simulating a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return res.json({
        success: true,
        data: {
          symptoms: ['mock fever', 'mock cough'],
          duration: '2 days',
          severity: 'medium',
          possible_conditions: ['viral infection', 'common cold'],
          priority: 'medium',
          summary: 'Patient reports mock fever and cough for 2 days. Recommend rest and hydration.'
        }
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
      systemInstruction: PROMPT,
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent(text);
    const outputText = result.response.text();
    const parsedData = JSON.parse(outputText);

    res.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});

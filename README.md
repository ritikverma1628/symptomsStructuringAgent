# 🩺 AI Symptom Summarizer Agent

An intelligent, full-stack application that leverages natural language processing to extract structured clinical insights from raw patient symptom descriptions. Built for healthcare triage efficiency.

## 🌟 Features
- **Natural Language Parsing**: Accepts unstructured text about patient symptoms (e.g., "I've had a headache and mild fever for 3 days").
- **Structured Clinical Output**: Automatically extracts key symptoms, duration, priority, severity, and possible conditions.
- **Modern UI/UX**: Clean, responsive, and animated user interface built with React, Tailwind CSS, and Lucide Icons.
- **Robust Backend**: Node.js and Express backend handling the heavy lifting, integrated directly with Google Gemini.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Axios, Lucide React
- **Backend**: Node.js, Express, CORS, Google Generative AI SDK
- **AI/LLM**: Google `gemini-1.5-flash`

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- An Google Gemini API Key

### Installation

1. **Clone the repository** (if not already done).
2. **Setup the Backend**
   ```bash
   cd "cognoizant hackathon/backend"
   npm install
   ```
   Create a `.env` file in the backend directory and add your Google Gemini API Key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Setup the Frontend**
   ```bash
   cd "../frontend"
   npm install
   ```

### Running Locally

1. **Start the Backend Server** (from the `backend` folder)
   ```bash
   npm run dev
   ```
   *The server will run on http://localhost:5000*

2. **Start the Frontend Client** (from the `frontend` folder)
   ```bash
   npm run dev
   ```
   *The Vite dev server will launch (usually on http://localhost:5173).*

## 🌍 Deployment
This project is configured to be seamlessly deployed via [Render](https://render.com/). 
A `render.yaml` Blueprint file is provided at the root of the project to deploy both the frontend and backend in one click. 

*(Make sure to set the `GEMINI_API_KEY` in the Render dashboard during deployment!)*

## ⚠️ Disclaimer
This is for demonstration and hackathon purposes. This AI tool **does not provide medical advice** and is not a substitute for professional medical diagnosis, treatment, or advice.

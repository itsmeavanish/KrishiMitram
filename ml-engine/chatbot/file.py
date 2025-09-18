# file.py
# Run with: uvicorn file:app --reload --host 0.0.0.0 --port 3001

import os
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq

# -------------------------
# Load environment
# -------------------------
load_dotenv()
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

# -------------------------
# Initialize LLM
# -------------------------
llm = ChatGroq(
    groq_api_key=GROQ_API_KEY,
    model_name="llama-3.3-70b-versatile",
)

# -------------------------
# Farmer Assistant Prompt
# -------------------------
prompt_template = """
You are a friendly and knowledgeable assistant for farmers.

- Always answer clearly and practically.  
- Focus on crops, soil health, weather, irrigation, pests, fertilizers, and sustainable farming.  
- Keep answers **short and in bullet points** (2–4 points max).  
- If the farmer asks something not about farming, politely guide them back to agriculture.  

Question:
{question}

Answer (in bullet points, as a helpful farmer's assistant):
"""

prompt = PromptTemplate(
    input_variables=["question"],
    template=prompt_template
)

# -------------------------
# FastAPI server
# -------------------------
app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/chat")
async def chat_endpoint(request: Request):
    data = await request.json()
    message = data.get("message", "")
    context_input = data.get("context", {})

    try:
        # Format question into prompt
        final_prompt = prompt.format(question=message)

        # Query LLM directly
        llm_response = llm.invoke(final_prompt)
        answer_text = (
            llm_response.content
            if hasattr(llm_response, "content")
            else str(llm_response)
        )

        # Generate contextual recommendations
        recommendations = []
        location = context_input.get("location", "").lower()
        crop = context_input.get("crop", "").lower()

        if "kerala" in location:
            recommendations.append("🌧️ In Kerala, watch out for monsoon rains and use drainage to protect crops.")
        if "rice" in crop:
            recommendations.append("🌾 For rice, choose varieties suited to local water levels and monitor pests like stem borer.")
        if "wheat" in crop:
            recommendations.append("🌱 For wheat, ensure timely sowing and balanced nitrogen use for higher yield.")

        # Severity logic (basic example)
        severity = "medium"
        if any(word in message.lower() for word in ["disease", "pest", "blight", "infection"]):
            severity = "high"
        elif any(word in message.lower() for word in ["fertilizer", "nutrition", "soil"]):
            severity = "low"

        return {
            "success": True,
            "response": {
                "answer": answer_text.strip(),
                "recommendations": recommendations,
                "severity": severity,
                "category": "general",
                "timestamp": str(datetime.utcnow()),
                "id": os.urandom(4).hex(),
            },
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
        }

# file.py
# Run with: uvicorn file:app --reload --host 0.0.0.0 --port 3001

import os
import json
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq
from langchain.schema import Document

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
# Load JSON data
# -------------------------
with open("data.json", "r", encoding="utf-8") as f:
    json_data = json.load(f)

# -------------------------
# Convert JSON to Documents
# -------------------------
documents = []
for item in json_data:
    content = "\n".join([f"{k}: {v}" for k, v in item.items()])
    documents.append(Document(page_content=content))

# -------------------------
# Split Documents into Chunks
# -------------------------
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
all_splits = text_splitter.split_documents(documents)

# -------------------------
# Vector Store
# -------------------------
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = Chroma.from_documents(documents=all_splits, embedding=embeddings)

# -------------------------
# Prompt Template to keep answers crop/farmer-focused
# -------------------------
prompt_template = """
You are an AI assistant for farmers. Answer questions **only** related to crops, farming, soil, weather for agriculture, pests, and fertilizers.
Use the context below to answer the question. If the context does not contain the answer, give a general farming advice.

Context:
{context}

Question:
{question}

Answer:
"""

prompt = PromptTemplate(
    input_variables=["context", "question"],
    template=prompt_template
)

# -------------------------
# QA Chain
# -------------------------
qachain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(),
    chain_type="stuff",
    chain_type_kwargs={"prompt": prompt}
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
        # Get answer from QA chain
        response = qachain.invoke({"query": message})
        answer_text = response.get("result", "")

        # Generate contextual recommendations
        recommendations = []
        location = context_input.get("location", "").lower()
        crop = context_input.get("crop", "").lower()

        if "kerala" in location:
            recommendations.append("Consider monsoon-specific precautions for Kerala climate")
        if "rice" in crop:
            recommendations.append("Use flood-resistant rice varieties in rainy season")
        if "wheat" in crop:
            recommendations.append("Monitor soil nitrogen levels for healthy wheat growth")

        # Severity logic (basic example)
        severity = "medium"
        if any(keyword in message.lower() for keyword in ["disease", "pest", "blight", "infection"]):
            severity = "high"
        elif any(keyword in message.lower() for keyword in ["fertilizer", "nutrition", "soil"]):
            severity = "low"

        return {
            "success": True,
            "response": {
                "answer": answer_text,
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

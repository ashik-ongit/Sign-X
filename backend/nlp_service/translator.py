"""
Folder: backend/nlp_service/

Takes raw text and returns a hardcoded Sign Language Gloss sequence,
matching the project's shared JSON contract:

{
  "raw_text": "...",
  "gloss_sequence": ["...", "..."]
}

Phase 2 will swap the hardcoded mock_gloss_map for a real local
Ollama / Qwen 2.5 translation call.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="SignX Avatar - NLP Gloss Translator",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextPayload(BaseModel):
    raw_text: str


# Hardcoded Gloss mapping for Phase 1
# (Will be replaced with local Ollama LLM in Phase 2)
mock_gloss_map = {
    "Hello welcome to live news": ["HELLO", "WELCOME", "NEWS", "LIVE"],
}

# Fallback gloss used when the exact sentence isn't in the mock map,
# so the pipeline never breaks during integration testing.
DEFAULT_GLOSS = ["HELLO", "WELCOME"]


@app.get("/")
def root():
    """Simple sanity check so Guy 3 / Guy 4 know the service is alive."""
    return {"service": "nlp_service", "status": "ok"}


@app.post("/translate-gloss")
def translate_to_gloss(payload: TextPayload):
    gloss_result = mock_gloss_map.get(payload.raw_text, DEFAULT_GLOSS)

    return {
        "raw_text": payload.raw_text,
        "gloss_sequence": gloss_result,
    }
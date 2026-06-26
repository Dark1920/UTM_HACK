from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models.schemas import (
    AnalyzeRequest,
    ReviewAnalysis,
    SummarizeRequest,
    Summary,
)
from services.analyzer import analyze_review
from services.summarizer import summarize_reviews

app = FastAPI(title="FasoArtisan AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/analyze", response_model=ReviewAnalysis)
async def analyze(req: AnalyzeRequest):
    try:
        result = await analyze_review(req.commentaire)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/summarize", response_model=Summary)
async def summarize(req: SummarizeRequest):
    try:
        result = await summarize_reviews(req.commentaires)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

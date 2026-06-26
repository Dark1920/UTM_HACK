from pydantic import BaseModel, Field


class CritereNote(BaseModel):
    qualite: float = Field(ge=0, le=5)
    professionnalisme: float = Field(ge=0, le=5)
    rapidite: float = Field(ge=0, le=5)
    prix: float = Field(ge=0, le=5)


class ReviewAnalysis(BaseModel):
    pertinent: bool
    note: float = Field(ge=0, le=5)
    sentiment: str = Field(pattern=r"^(positif|neutre|negatif)$")
    criteres: CritereNote
    points_forts: list[str] = []
    points_faibles: list[str] = []
    raison: str


class Summary(BaseModel):
    resume: str
    points_forts: list[str] = []
    points_faibles: list[str] = []


class AnalyzeRequest(BaseModel):
    commentaire: str = Field(min_length=1, max_length=5000)


class SummarizeRequest(BaseModel):
    commentaires: list[str] = Field(min_length=1, max_length=100)

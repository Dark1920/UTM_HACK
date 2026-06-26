from clients.grok import chat_completion
from prompts.analyze import build_analyze_prompt
from utils.parser import extract_json
from models.schemas import ReviewAnalysis
from config import MIN_COMMENT_LENGTH


def pre_validate(commentaire: str) -> bool:
    cleaned = commentaire.strip()
    if len(cleaned) < MIN_COMMENT_LENGTH:
        return False
    if cleaned.count("#") > len(cleaned) * 0.5:
        return False
    return True


async def analyze_review(commentaire: str) -> ReviewAnalysis:
    if not pre_validate(commentaire):
        return ReviewAnalysis(
            pertinent=False,
            note=0,
            sentiment="neutre",
            criteres={"qualite": 0, "professionnalisme": 0, "rapidite": 0, "prix": 0},
            points_forts=[],
            points_faibles=[],
            raison="Commentaire vide ou non pertinent (filtrage deterministe).",
        )

    messages = build_analyze_prompt(commentaire)
    raw_response = await chat_completion(messages)
    parsed = extract_json(raw_response)
    return ReviewAnalysis(**parsed)

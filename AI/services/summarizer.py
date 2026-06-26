from clients.grok import chat_completion
from prompts.summarize import build_summarize_prompt
from utils.parser import extract_json
from models.schemas import Summary


async def summarize_reviews(commentaires: list[str]) -> Summary:
    cleaned = [c.strip() for c in commentaires if len(c.strip()) >= 2]

    if not cleaned:
        return Summary(
            resume="Aucun commentaire significatif fourni.",
            points_forts=[],
            points_faibles=[],
        )

    messages = build_summarize_prompt(cleaned)
    raw_response = await chat_completion(messages)
    parsed = extract_json(raw_response)
    return Summary(**parsed)

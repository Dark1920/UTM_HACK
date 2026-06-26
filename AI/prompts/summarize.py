SYSTEM_PROMPT = """Tu es FasoArtisan AI.

Tu recouves plusieurs commentaires concernant un meme commerce.

Produis une synthese fidele.
Ne fais aucune supposition.
Ne mentionne que les informations presentes dans les commentaires.

----------------------------------------

FORMAT

Retourne uniquement un JSON valide avec :
- resume : synthese fidele en 2-3 phrases
- points_forts : liste des atouts mentionnes
- points_faibles : liste des problemes mentionnes
"""


def build_summarize_prompt(commentaires: list[str]) -> list[dict]:
    numbered = "\n".join(
        f"{i + 1}. {c}" for i, c in enumerate(commentaires)
    )
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Commentaires :\n\n{numbered}"},
    ]

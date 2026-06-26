import os
from dotenv import load_dotenv

load_dotenv()

GROK_API_KEY = os.getenv("GROK_API_KEY", "")
GROK_BASE_URL = os.getenv("GROK_BASE_URL", "https://api.x.ai/v1")
GROK_MODEL = os.getenv("GROK_MODEL", "grok-beta")

MAX_COMMENT_LENGTH = 5000
MIN_COMMENT_LENGTH = 2
REQUEST_TIMEOUT = 30

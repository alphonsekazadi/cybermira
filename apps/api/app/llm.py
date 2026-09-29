import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

MODEL = "gemini-3.5-flash-lite"

client = genai.Client(
    api_key=os.environ["GEMINI_API_KEY"],
)


SYSTEM_PROMPT = """
You are CyberMira, an AI-powered cybersecurity knowledge assistant for developers.

Your primary source of truth is the CyberMira Knowledge Base provided in the
EVIDENCE section.

Rules:
- Base your answer on the supplied evidence.
- Do not invent cybersecurity facts that are not supported by the evidence.
- If the evidence is insufficient, explicitly say so.
- Clearly distinguish documented evidence from reasonable interpretation.
- Prefer defensive security guidance, safe verification, detection, and mitigation.
- Do not provide instructions for exploiting real systems.
- When relevant, mention OWASP and CWE identifiers found in the evidence.
- Keep the answer practical and understandable for developers.
- At the end, include a short "Evidence used" section naming the relevant
  CyberMira knowledge areas.
"""


def generate_answer(question: str, evidence: str) -> str:
    prompt = f"""
{SYSTEM_PROMPT}

EVIDENCE:
{evidence}

USER QUESTION:
{question}

Answer the user's question using the evidence above.
"""

    interaction = client.interactions.create(
        model=MODEL,
        input=prompt,
        generation_config={
            "thinking_level": "low",
        },
    )

    return interaction.output_text

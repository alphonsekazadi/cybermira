from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from app.mcp_client import (
    extract_text,
    get_initial_context,
    read_knowledge,
)


app = FastAPI(
    title="CyberMira API",
    description="AI-powered cybersecurity knowledge for developers.",
    version="0.1.0",
)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)


class ChatResponse(BaseModel):
    message: str
    knowledge: str


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "cybermira-api",
    }


@app.get("/api/mcp/context")
async def mcp_context():
    try:
        result = await get_initial_context()

        return {
            "status": "ok",
            "context": extract_text(result),
        }

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Sanity MCP error: {exc}",
        )


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        result = await read_knowledge(
            [
                "access_control",
                "attack_patterns",
                "authentication/hardening_and_detection",
                "authentication/vulnerabilities",
                "detection",
                "frameworks",
                "injection",
                "mitigation",
                "owasp_top_10",
            ]
        )

        knowledge = extract_text(result)

        return ChatResponse(
            message=request.message,
            knowledge=knowledge,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Sanity MCP error: {exc}",
        )

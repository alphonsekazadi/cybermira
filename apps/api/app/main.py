from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from app.llm import generate_answer
from app.mcp_client import (
    extract_text,
    get_initial_context,
    read_knowledge,
)
from app.retrieval import select_paths


app = FastAPI(
    title="CyberMira API",
    description="AI-powered cybersecurity knowledge for developers.",
    version="0.2.0",
)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=5000)


class ChatResponse(BaseModel):
    message: str
    answer: str
    knowledge_paths: list[str]


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
        paths = select_paths(request.message)

        result = await read_knowledge(paths)

        knowledge = extract_text(result)

        answer = generate_answer(
            question=request.message,
            evidence=knowledge,
        )

        return ChatResponse(
            message=request.message,
            answer=answer,
            knowledge_paths=paths,
        )

    except Exception as exc:
        import traceback

        traceback.print_exc()

        raise HTTPException(
            status_code=502,
            detail=f"CyberMira error: {type(exc).__name__}: {exc}",
        )

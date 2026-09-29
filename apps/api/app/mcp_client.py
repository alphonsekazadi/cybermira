import os

import httpx
from dotenv import load_dotenv

load_dotenv()

MCP_URL = os.environ["SANITY_CONTEXT_MCP_URL"]
SANITY_TOKEN = os.environ["SANITY_ORGANIZATION_TOKEN"]
KNOWLEDGE_BASE_ID = os.environ["SANITY_KNOWLEDGE_BASE_ID"]

MCP_PROTOCOL_VERSION = "2025-06-18"


async def call_mcp_tool(
    name: str,
    arguments: dict,
):
    headers = {
        "Authorization": f"Bearer {SANITY_TOKEN}",
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "MCP-Protocol-Version": MCP_PROTOCOL_VERSION,
    }

    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {
            "name": name,
            "arguments": arguments,
        },
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            MCP_URL,
            headers=headers,
            json=payload,
        )

    response.raise_for_status()

    data = response.json()

    if "error" in data:
        raise RuntimeError(
            f"MCP error: {data['error']}"
        )

    return data["result"]


async def get_initial_context():
    return await call_mcp_tool(
        "initial_context",
        {},
    )


async def read_knowledge(paths: list[str]):
    return await call_mcp_tool(
        "knowledge_base_read",
        {
            "knowledgeBase": KNOWLEDGE_BASE_ID,
            "paths": paths,
        },
    )


def extract_text(result) -> str:
    parts = []

    for item in result.get("content", []):
        if item.get("type") == "text":
            parts.append(item.get("text", ""))

    return "\n\n".join(parts)

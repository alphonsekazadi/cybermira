import os

import httpx
from dotenv import load_dotenv
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client

load_dotenv()

MCP_URL = os.environ["SANITY_CONTEXT_MCP_URL"]
SANITY_TOKEN = os.environ["SANITY_ORGANIZATION_TOKEN"]
KNOWLEDGE_BASE_ID = os.environ["SANITY_KNOWLEDGE_BASE_ID"]


async def call_mcp_tool(name: str, arguments: dict):
    headers = {
        "Authorization": f"Bearer {SANITY_TOKEN}",
        "Accept": "application/json, text/event-stream",
    }

    timeout = httpx.Timeout(
        connect=30,
        read=300,
        write=30,
        pool=30,
    )

    async with httpx.AsyncClient(
        headers=headers,
        timeout=timeout,
    ) as http_client:

        async with streamable_http_client(
            MCP_URL,
            http_client=http_client,
        ) as (read_stream, write_stream):

            async with ClientSession(
                read_stream,
                write_stream,
            ) as session:

                await session.initialize()

                return await session.call_tool(
                    name,
                    arguments,
                )


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

    for item in result.content:
        if hasattr(item, "text"):
            parts.append(item.text)

    return "\n\n".join(parts)

import asyncio

from app.mcp_client import call_mcp_tool


async def main():
    result = await call_mcp_tool(
        "initial_context",
        {},
    )

    print(result)


if __name__ == "__main__":
    asyncio.run(main())

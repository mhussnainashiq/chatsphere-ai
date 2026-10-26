from openai import AsyncOpenAI, APIConnectionError, RateLimitError, APIStatusError
from fastapi import HTTPException
from app.core.config import settings


async def generate_reply(history: list[dict[str, str]]) -> str:
    if not settings.openai_api_key.strip():
        raise HTTPException(
            status_code=503,
            detail="AI is not configured. Add OPENAI_API_KEY to backend/.env and restart the backend."
        )

    client = AsyncOpenAI(api_key=settings.openai_api_key)
    try:
        response = await client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {"role": "system", "content": (
                    "You are ChatSphere, a helpful, thoughtful AI assistant. "
                    "Be accurate, clear, and friendly. Use Markdown when useful. "
                    "If uncertain, say so rather than inventing facts."
                )},
                *history,
            ],
            temperature=0.7,
        )
        answer = response.choices[0].message.content
        if not answer:
            raise HTTPException(status_code=502, detail="The AI provider returned an empty response.")
        return answer.strip()
    except RateLimitError:
        raise HTTPException(status_code=429, detail="The AI provider rate limit or quota was reached. Check your API billing and limits.")
    except APIConnectionError:
        raise HTTPException(status_code=502, detail="Could not connect to the AI provider. Check your network and try again.")
    except APIStatusError as exc:
        raise HTTPException(status_code=502, detail=f"The AI provider returned an error (HTTP {exc.status_code}).")
    finally:
        await client.close()

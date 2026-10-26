from datetime import datetime, timezone
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.database import get_db, Conversation, Message
from app.schemas.chat import MessageCreate, ConversationOut, ConversationDetail, ChatReply
from app.core.config import settings
from app.services.ai_service import generate_reply

router = APIRouter(prefix="/api", tags=["chat"])


def now_utc():
    return datetime.now(timezone.utc)


@router.get("/health")
def health():
    return {
        "status": "ok",
        "ai_configured": bool(settings.openai_api_key.strip()),
        "model": settings.openai_model,
    }


@router.post("/conversations", response_model=ConversationOut, status_code=201)
def create_conversation(db: Session = Depends(get_db)):
    conversation = Conversation(id=str(uuid4()), title="New chat")
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


@router.get("/conversations", response_model=list[ConversationOut])
def list_conversations(db: Session = Depends(get_db)):
    return list(db.scalars(select(Conversation).order_by(Conversation.updated_at.desc())).all())


@router.get("/conversations/{conversation_id}", response_model=ConversationDetail)
def get_conversation(conversation_id: str, db: Session = Depends(get_db)):
    conversation = db.get(Conversation, conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    return conversation


@router.delete("/conversations/{conversation_id}", status_code=204)
def delete_conversation(conversation_id: str, db: Session = Depends(get_db)):
    conversation = db.get(Conversation, conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    db.delete(conversation)
    db.commit()
    return None


@router.post("/conversations/{conversation_id}/messages", response_model=ChatReply)
async def send_message(conversation_id: str, payload: MessageCreate, db: Session = Depends(get_db)):
    content = payload.content.strip()
    if not content:
        raise HTTPException(status_code=422, detail="Message cannot be blank.")
    if len(content) > settings.max_message_length:
        raise HTTPException(status_code=413, detail=f"Message exceeds the {settings.max_message_length}-character limit.")

    conversation = db.get(Conversation, conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found.")

    user_message = Message(conversation_id=conversation_id, role="user", content=content)
    db.add(user_message)
    db.flush()

    # Keep the latest 30 messages as context, including the message just added.
    previous = list(db.scalars(
        select(Message).where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.desc(), Message.id.desc()).limit(30)
    ).all())
    history = [{"role": m.role, "content": m.content} for m in reversed(previous)]

    try:
        answer = await generate_reply(history)
    except Exception:
        # Do not leave a user message persisted as if the exchange succeeded.
        db.rollback()
        raise

    assistant_message = Message(conversation_id=conversation_id, role="assistant", content=answer)
    db.add(assistant_message)
    if conversation.title == "New chat":
        conversation.title = content[:54] + ("…" if len(content) > 54 else "")
    conversation.updated_at = now_utc()
    db.commit()
    db.refresh(user_message)
    db.refresh(assistant_message)
    db.refresh(conversation)
    return ChatReply(
        conversation_id=conversation_id,
        user_message=user_message,
        assistant_message=assistant_message,
    )

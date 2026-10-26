# ChatSphere AI

A polished full-stack AI chat application built with React, Vite, JavaScript, FastAPI, OpenAI, and SQLite. ChatSphere supports persistent conversations, context-aware AI replies, Markdown responses, light/dark themes, and responsive layouts.

## Features

- Real AI conversations through the official OpenAI Python SDK.
- SQLite persistence for conversations and messages.
- Multiple conversations, automatic titles, history selection, and deletion.
- Context-aware follow-up questions using recent conversation messages.
- Markdown, tables, lists, and code blocks in assistant replies.
- Typing indicator, auto-scroll, timestamps, and copy response action.
- Responsive sidebar for mobile and desktop.
- Light and dark themes.
- API health endpoint reports whether an API key is configured.
- Environment-based secrets and configurable model.
- FastAPI request validation and readable API errors.

## Technology stack

**Frontend:** React, Vite, JavaScript, CSS, Lucide React, React Markdown  
**Backend:** Python, FastAPI, Pydantic, SQLAlchemy, SQLite, OpenAI SDK  
**Testing:** pytest, FastAPI TestClient



## Requirements

- Python 3.11 or newer (use a Python version supported by your installed dependencies).
- Node.js 20 or newer.
- An OpenAI API key for live AI responses. API usage may incur charges.

## Setup on Windows PowerShell

Open **two separate PowerShell terminals** from the project root.

### 1. Backend

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
notepad .env
```

Add your API key in `backend/.env`:

```env
OPENAI_API_KEY=your_real_api_key_here
OPENAI_MODEL=gpt-4o-mini
DATABASE_URL=sqlite:///./chatsphere.db=
MAX_MESSAGE_LENGTH=12000
```

Save the file, then start the API:

The health response includes `ai_configured`. A value of `false` means the API key is missing; chat requests will return a clear configuration error.

### 2. Frontend

In a second PowerShell terminal, from the project root:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API and AI configuration status |
| POST | `/api/conversations` | Create a conversation |
| GET | `/api/conversations` | List conversations |
| GET | `/api/conversations/{id}` | Get a conversation and its messages |
| DELETE | `/api/conversations/{id}` | Delete a conversation |
| POST | `/api/conversations/{id}/messages` | Save a user message and generate an AI reply |

## Run tests

From the `backend` folder with the virtual environment activated:

```powershell
pytest -q
```

Tests cover the health response and conversation create/read/delete flow. Sending a real AI message additionally requires a valid OpenAI API key and available API quota.

## Troubleshooting

- **`OPENAI_API_KEY` missing:** Set it in `backend/.env`, then restart Uvicorn. Never put it in frontend environment variables.
- **401 from OpenAI:** Check that the key is valid and belongs to a project with API access.
- **429 from OpenAI:** Check usage limits, billing, and rate limits.
- **Backend connection error:** Confirm Uvicorn is running on port 8000 and the frontend base URL matches.
- **CORS error:** Ensure `FRONTEND_ORIGINS` includes the exact frontend origin, including port, and restart the backend.
- **PowerShell blocks activation:** Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`, then activate the environment again.
- **Port already in use:** Stop the other process or select a different port and update `VITE_API_BASE_URL` accordingly.

## Security notes

- Never commit `.env` files or API keys.
- The app does not store API keys in SQLite or browser local storage.
- Configure CORS to trusted origins before deployment.
- This is a portfolio starter, not a hardened multi-user production service. Before public deployment, add authentication, per-user data isolation, rate limiting, retention controls, and deployment secrets management.


## Demo questions

- Explain REST APIs using a simple real-world example.
- Create a React component with accessible form validation.
- Help me debug a Python function and explain the fix.
- Write a professional README for an AI SaaS product.
- Compare SQLite and PostgreSQL for a small application.

## Future enhancements

- Authentication and user-specific conversation ownership.
- Streaming responses with Server-Sent Events.
- Search, rename, export, and archive conversations.
- File uploads and retrieval-augmented generation (RAG).
- Conversation settings and model selection.
- Automated frontend tests and expanded backend test coverage.
- Docker setup, CI checks, and deployment configuration.

## GitHub repository presentation

**Suggested description:** Full-stack AI chatbot built with React, FastAPI, OpenAI, and SQLite.

**Suggested topics:** `ai-chatbot`, `openai`, `fastapi`, `react`, `vite`, `python`, `sqlite`, `llm`, `full-stack`, `javascript`

## Portfolio description

ChatSphere AI is a responsive full-stack chatbot featuring context-aware OpenAI conversations, persistent SQLite chat history, Markdown rendering, and a modern React interface. Built with FastAPI and Python on the backend, it demonstrates API integration, database design, environment-based configuration, and practical AI application development.

## License

Choose and add a license before distributing the project. If you want an open-source portfolio project, MIT is a common permissive option.

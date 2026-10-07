
# MAYA — Version 04

V4 turns the project into a stronger product/demo architecture.

## What was added

### Identity layer
- Guest/profile mode
- Display name
- User-specific memory namespace
- UI for creating/updating identity

### Memory architecture
- SQLite users table
- SQLite memories table with `user_id`
- API endpoints:
  - `POST /profile`
  - `GET /memories/{user_id}`
  - `POST /memories`

### Presentation Mode
A full-screen, five-step judge/demo experience:

1. Meet MAYA
2. Memory
3. Emotion
4. Is she real?
5. The Tattva question

Keyboard:
- Right arrow = next
- Left arrow = back
- Esc = exit

### Avatar
The interface now has a stronger expression layer and can receive emotion state from the AI response.

## Run

```bash
pip install -r requirements.txt
export GEMINI_API_KEY="YOUR_KEY"
uvicorn app:app --reload --port 8000
```

Windows PowerShell:

```powershell
$env:GEMINI_API_KEY="YOUR_KEY"
uvicorn app:app --reload --port 8000
```

Open:

http://localhost:8000

## Demo script

Start Presentation Mode for a clean judge walkthrough, then exit and demonstrate the live chat.

Recommended final line:

> "MAYA can make you feel that there is someone behind the interface. Tattva asks us to look underneath that feeling and ask what is actually there."

## Production note

The V4 identity layer is deliberately simple for a college/demo project. Before public deployment, replace the browser-only profile identity with real authentication and secure sessions, and add proper authorization around memory APIs.


# MAYA — Version 02

Version 02 turns the static demo into a real AI web app.

## Added

- Gemini-powered MAYA backend
- SQLite memory
- Automatic memory extraction for explicit user facts
- Emotion-state detection
- Browser microphone speech-to-text
- Browser text-to-speech
- FastAPI backend
- Single-server deployment structure

## Setup

1. Install Python 3.10+.
2. Open a terminal in this folder.
3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set your Gemini API key as an environment variable.

Windows PowerShell:

```powershell
$env:GEMINI_API_KEY="YOUR_KEY_HERE"
```

macOS/Linux:

```bash
export GEMINI_API_KEY="YOUR_KEY_HERE"
```

5. Start the server:

```bash
uvicorn app:app --reload --port 8000
```

6. Open:

http://localhost:8000

## Important

Do NOT put your API key inside `script.js` or `index.html`.
The browser talks to the FastAPI backend, and the backend talks to Gemini.

Voice input/output uses the browser's built-in speech APIs, so support can vary by browser.

## Next

Version 03 can add:
- login and separate memories per user
- a real animated MAYA avatar
- emotion-driven visual states
- memory management UI
- deployment to a public URL
- a presentation/demo mode for judges

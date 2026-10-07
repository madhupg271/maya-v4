
# MAYA — Version 03

V3 adds the **experience layer** on top of Version 2.

## New

- Animated MAYA scanline / visual states
- Memory drawer
- Browser-local memory storage
- "Tattva Reveal" modal for the presentation/demo
- Emotion-driven visual glow hooks
- More polished competition/demo flow

## Run with Version 2 backend

Keep `app.py`, `requirements.txt`, and your `GEMINI_API_KEY` setup from V2.

```bash
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Open:

http://localhost:8000

## Demo flow for judges

1. Start on Home.
2. Click **Talk to MAYA**.
3. Tell MAYA your name.
4. Ask: "Do you have emotions?"
5. Ask: "Are you real?"
6. Open **Memory** to show the stored context.
7. Scroll to **Tattva**.
8. Click **Reveal what is underneath**.
9. Explain: the interface creates the appearance; the underlying system is computation.

## V4 idea

Add login, per-user cloud memory, a richer 3D/2D avatar, emotion classification from voice/text, and deployment.

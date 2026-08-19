# Communication Hub API

All routes use the `/api/v1` prefix and require an access token in the `Authorization: Bearer <token>` header. User identity is always taken from that token; request bodies never select another user.

## Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/communication/aac/categories` | List AAC categories with symbols |
| GET | `/communication/aac/symbols` | List symbols; optionally filter with `?category=needs` |
| POST | `/communication/aac/symbols` | Add a custom symbol (admin only) |
| PATCH/DELETE | `/communication/aac/symbols/{symbol_id}` | Edit or remove a custom symbol (admin only) |
| POST | `/communication/aac/selection` | Record one symbol selection |
| POST | `/communication/aac/generate` | Compose selected symbols and record usage |
| POST | `/communication/alerts` | Create `NEED_HELP`, `NEED_SPACE`, or `CANT_SPEAK` alert |
| GET | `/communication/alerts` | List the authenticated user's alerts |
| PATCH | `/communication/alerts/{alert_id}` | Mark the user's alert `read` or `resolved` |
| GET | `/communication/emotion` | Get the current emotional state |
| POST | `/communication/emotion/state` | Save an emotional state without invoking AI |
| POST | `/communication/emotion` | Save an emotional state and generate suggested wording |
| POST | `/communication/generate-sentence` | Generate a sentence from text/AAC keywords, emotion, and tone |
| GET | `/communication/history` | Paginated event history with `type` and `sort` filters |
| GET | `/communication/preferences` | Get communication preferences and frequent symbols |
| PUT | `/communication/preferences` | Partially update communication preferences |

Interactive schemas and request examples are available at `http://localhost:8000/api/v1/docs` while the backend is running.

## Local setup

1. Copy `.env.example` to `.env` and configure MongoDB, JWT secret, and optionally `AI_API_KEY`.
2. Install dependencies with `python -m pip install -r requirements.txt`.
3. Start with `python run.py` from the `backend` directory.
4. Run tests with `$env:DEBUG='True'; python -m pytest tests/unit/test_part1_backend.py -q` in PowerShell.

Urgent alerts create in-app notification records for linked caregivers when `notification_preferences.caregiver_alerts` is enabled. No caregiver contact details are returned by Communication Hub endpoints.

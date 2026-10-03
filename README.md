# 🍽️ Meal Planner

A full-stack meal planning app with a React frontend and FastAPI backend.

## Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Frontend   | React 19, Vite 8, Tailwind CSS v4 |
| Backend    | Python, FastAPI, SQLAlchemy       |
| Database   | SQLite                            |
| Deployment | Docker Compose, Nginx             |

## Quick Start

### Docker (Production)

```bash
docker compose up --build -d
```

Open **http://127.0.0.1:8080**

### Local Development

Two terminals — one for each service:

**Backend:**

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Open **http://127.0.0.1:5173**

## API Endpoints

| Method | Path                                  | Description                                               |
| ------ | ------------------------------------- | --------------------------------------------------------- |
| `GET`  | `/meals/`                             | List all meals                                            |
| `POST` | `/meals/`                             | Add a meal (multipart: name, ingredients, optional image) |
| `GET`  | `/generate-plan/?date_str=YYYY-MM-DD` | Generate a random 3-meal plan + shopping list             |

## Project Structure

```
├── docker-compose.yml    # Orchestration (Docker mode)
├── backend/
│   ├── main.py           # FastAPI app + routes
│   ├── models.py         # SQLAlchemy models
│   ├── database.py       # DB connection (SQLite)
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile
├── frontend/
│   ├── index.html        # Entry point
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── main.jsx      # React entry
│   │   └── index.css     # Tailwind import
│   ├── vite.config.js    # Vite + proxy config
│   ├── tailwind.config.js
│   ├── nginx.conf        # API proxy for production
│   └── Dockerfile
```

## Architecture

Both services run on the same Docker network so the frontend can reach the backend by container name (`backend`). In production, Nginx proxies `/api/*` requests to the backend container. In development, Vite's dev server does the same proxying.

import os
import random
import shutil
import uuid
from io import BytesIO

import database
import models
from fastapi import Depends, FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from PIL import Image as PILImage
from sqlalchemy.orm import Session

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup uploads directory
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.post("/meals/")
async def create_meal(
    name: str = Form(...),
    ingredients: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(database.get_db),
):
    image_url = None
    if image:
        filename = f"{uuid.uuid4()}.jpg"
        image_path = os.path.join(UPLOAD_DIR, filename)
        img = PILImage.open(image.file).convert("RGB")
        size = (200, 200)
        # Crop to square from center, then resize
        w, h = img.size
        side = min(w, h)
        left = (w - side) // 2
        top = (h - side) // 2
        img = img.crop((left, top, left + side, top + side))
        img = img.resize(size, PILImage.LANCZOS)
        img.save(image_path, "JPEG", quality=85)
        image_url = f"/uploads/{filename}"

    new_meal = models.Meal(name=name, ingredients=ingredients, image_url=image_url)
    db.add(new_meal)
    db.commit()
    return {
        "id": new_meal.id,
        "name": new_meal.name,
        "ingredients": new_meal.ingredients,
        "image_url": new_meal.image_url,
    }


@app.get("/meals/")
async def get_meals(db: Session = Depends(database.get_db)):
    return [
        {
            "id": m.id,
            "name": m.name,
            "ingredients": m.ingredients,
            "image_url": m.image_url,
        }
        for m in db.query(models.Meal).all()
    ]


@app.delete("/meals/{meal_id}")
async def delete_meal(meal_id: int, db: Session = Depends(database.get_db)):
    meal = db.query(models.Meal).filter(models.Meal.id == meal_id).first()
    if not meal:
        return {"message": "Meal not found"}, 404
    db.delete(meal)
    db.commit()
    return {"message": "Meal deleted"}


@app.get("/generate-plan/")
async def generate_plan(date_str: str = None, db: Session = Depends(database.get_db)):
    meals = db.query(models.Meal).all()
    if not meals:
        return {"meals": [], "shopping_list": []}

    # Select 7 random meals (or fewer if not enough)
    selected_meals = random.sample(meals, min(len(meals), 7))

    shopping_list = []
    for meal in selected_meals:
        # Split ingredients back into a list
        items = [i.strip() for i in meal.ingredients.split(",")]
        shopping_list.extend(items)

    return {
        "date": date_str,
        "meals": [
            {
                "id": m.id,
                "name": m.name,
                "ingredients": m.ingredients,
                "image_url": m.image_url,
            }
            for m in selected_meals
        ],
        "shopping_list": shopping_list,
    }


# Serve frontend static files (after API routes so they take priority)
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.isdir(FRONTEND_DIR):
    from fastapi.responses import FileResponse

    @app.get("/{path:path}", include_in_schema=False)
    async def serve_frontend(path: str = "/"):
        if path == "/":
            path = "index.html"
        file_path = os.path.join(FRONTEND_DIR, path.lstrip("/"))
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        # SPA fallback: return index.html
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

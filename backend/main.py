import os
import random
import shutil
from fastapi import FastAPI, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import models, database

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
    db: Session = Depends(database.get_db)
):
    image_url = None
    if image:
        image_path = os.path.join(UPLOAD_DIR, image.filename)
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        # The frontend uses /uploads/filename, Nginx/FastAPI will map this
        image_url = f"/uploads/{image.filename}"

    new_meal = models.Meal(name=name, ingredients=ingredients, image_url=image_url)
    db.add(new_meal)
    db.commit()
    return new_meal

@app.get("/meals/")
async def get_meals(db: Session = Depends(database.get_db)):
    return db.query(models.Meal).all()

@app.get("/generate-plan/")
async def generate_plan(date_str: str = None, db: Session = Depends(database.get_db)):
    meals = db.query(models.Meal).all()
    if not meals:
        return {"meals": [], "shopping_list": []}
    
    # Select 3 random meals (or fewer if not enough)
    selected_meals = random.sample(meals, min(len(meals), 3))
    
    shopping_list = []
    for meal in selected_meals:
        # Split ingredients back into a list
        items = [i.strip() for i in meal.ingredients.split(",")]
        shopping_list.extend(items)
        
    return {
        "date": date_str,
        "meals": selected_meals,
        "shopping_list": shopping_list
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

from sqlalchemy import Column, Integer, String, Text
from database import Base

class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    ingredients = Column(Text)  # Stored as comma-separated string
    image_url = Column(String, nullable=True)

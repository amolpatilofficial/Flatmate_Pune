from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Any
from database import db

router = APIRouter(prefix="/api/seed", tags=["seed"])

class SeedData(BaseModel):
    users: List[Any]
    properties: List[Any]
    profiles: List[Any]

@router.post("/")
async def seed_database(data: SeedData):
    # clear existing
    await db.users.delete_many({})
    await db.properties.delete_many({})
    await db.profiles.delete_many({})
    
    if data.users:
        await db.users.insert_many(data.users)
    if data.properties:
        await db.properties.insert_many(data.properties)
    if data.profiles:
        await db.profiles.insert_many(data.profiles)
        
    return {"message": "Database seeded successfully"}

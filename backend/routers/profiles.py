from fastapi import APIRouter, HTTPException
from typing import List
from models import FlatmateProfile
from database import db
from pydantic import BaseModel

class StatusUpdate(BaseModel):
    status: str

router = APIRouter(prefix="/api/profiles", tags=["profiles"])

@router.get("/", response_model=List[FlatmateProfile])
async def get_profiles():
    cursor = db.profiles.find({}, {"_id": 0})
    profiles = await cursor.to_list(length=1000)
    return profiles

@router.post("/", response_model=FlatmateProfile)
async def create_profile(profile: FlatmateProfile):
    profile_dict = profile.model_dump()
    await db.profiles.insert_one(profile_dict)
    return profile_dict

@router.get("/{profile_id}", response_model=FlatmateProfile)
async def get_profile(profile_id: str):
    profile = await db.profiles.find_one({"id": profile_id}, {"_id": 0})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/{profile_id}")
async def update_profile(profile_id: str, profile: FlatmateProfile):
    profile_dict = profile.model_dump()
    result = await db.profiles.replace_one(
        {"id": profile_id},
        profile_dict
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile_dict

@router.put("/{profile_id}/status")
async def update_status(profile_id: str, status_update: StatusUpdate):
    result = await db.profiles.update_one(
        {"id": profile_id},
        {"$set": {"status": status_update.status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"message": "Status updated successfully"}

@router.delete("/{profile_id}")
async def delete_profile(profile_id: str):
    await db.profiles.delete_one({"id": profile_id})
    return {"message": "Deleted successfully"}

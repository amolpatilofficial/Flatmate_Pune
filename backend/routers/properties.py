from fastapi import APIRouter, HTTPException
from typing import List
from models import PropertyListing, PropertyListingUpdateStatus
from database import db

router = APIRouter(prefix="/api/properties", tags=["properties"])

@router.get("/", response_model=List[PropertyListing])
async def get_properties():
    cursor = db.properties.find({}, {"_id": 0})
    properties = await cursor.to_list(length=1000)
    return properties

@router.get("/{listing_id}", response_model=PropertyListing)
async def get_property(listing_id: str):
    property = await db.properties.find_one({"id": listing_id}, {"_id": 0})
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    return property

@router.post("/", response_model=PropertyListing)
async def create_property(listing: PropertyListing):
    listing_dict = listing.model_dump()
    await db.properties.insert_one(listing_dict)
    return listing_dict

@router.put("/{listing_id}")
async def update_property(listing_id: str, listing: PropertyListing):
    listing_dict = listing.model_dump()
    result = await db.properties.replace_one(
        {"id": listing_id},
        listing_dict
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing_dict

@router.put("/{listing_id}/status")
async def update_status(listing_id: str, status_update: PropertyListingUpdateStatus):
    result = await db.properties.update_one(
        {"id": listing_id},
        {"$set": {"status": status_update.status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Listing not found")
    return {"message": "Status updated successfully"}

@router.delete("/{listing_id}")
async def delete_property(listing_id: str):
    await db.properties.delete_one({"id": listing_id})
    return {"message": "Deleted successfully"}

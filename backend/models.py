import uuid
from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field

def generate_id():
    return str(uuid.uuid4())

# User Models
class UserSchema(BaseModel):
    id: str = Field(default_factory=generate_id)
    name: str
    email: str
    phone: Optional[str] = None
    password: str
    isAdmin: bool = False
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    isAdmin: bool
    createdAt: str

# Property Models
class PropertyListing(BaseModel):
    id: str = Field(default_factory=generate_id)
    category: str
    title: str
    description: str
    propertyType: str
    area: str
    address: str
    price: float
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    amenities: List[str] = []
    lift: bool = False
    waterType: str
    ownerId: str
    ownerName: str
    ownerEmail: str
    ownerPhone: str
    status: str = 'pending'
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    aadhaarUploaded: bool = False
    images: List[str] = []

class PropertyListingUpdateStatus(BaseModel):
    status: str

# Flatmate Profile Models
class FlatmateProfile(BaseModel):
    id: str = Field(default_factory=generate_id)
    name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    occupation: Optional[str] = None
    preferredArea: Optional[str] = None
    budget: Optional[float] = None
    role: Optional[str] = None # 'pg_owner', 'flat_owner', 'roommate_seeker'
    lookingFor: Optional[str] = None
    vegetarian: bool = False
    smoking: bool = False
    drinking: bool = False
    petFriendly: bool = False
    description: str = ""
    phone: Optional[str] = None
    userId: str
    userEmail: Optional[str] = None
    # Room details (for owners)
    roomType: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    amenities: List[str] = []
    lift: bool = False
    address: Optional[str] = None
    roomPhotos: List[str] = []
    status: str = 'pending'
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Legacy Status Check
class StatusCheck(BaseModel):
    id: str = Field(default_factory=generate_id)
    client_name: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class StatusCheckCreate(BaseModel):
    client_name: str

from fastapi import APIRouter, HTTPException
from models import UserSchema, UserLogin, UserResponse
from database import db
from passlib.context import CryptContext

router = APIRouter(prefix="/api/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register", response_model=UserResponse)
async def register(user: UserSchema):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)
    user_dict = user.model_dump()
    user_dict["password"] = hashed_password
    await db.users.insert_one(user_dict)

    return user_dict


@router.post("/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    is_valid = False
    try:
        is_valid = pwd_context.verify(credentials.password, user["password"])
    except ValueError:
        is_valid = (credentials.password == user["password"])

    if not is_valid and user["password"] != credentials.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user.pop("password", None)
    user.pop("_id", None)
    return {"token": user["id"], "user": user}


@router.get("/me", response_model=UserResponse)
async def get_me(user_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.pop("_id", None)
    return user

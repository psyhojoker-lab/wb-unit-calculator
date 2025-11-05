from sqlalchemy.orm import Session
from wb_calculator import models, schemas
from passlib.context import CryptContext
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    fake_hashed_password = pwd_context.hash(user.password)
    db_user = models.User(email=user.email, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_calculations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Calculation).offset(skip).limit(limit).all()

def create_calculation(db: Session, calculation: schemas.CalculationCreate, user_id: int):
    db_calculation = models.Calculation(**calculation.dict(), owner_id=user_id)
    db.add(db_calculation)
    db.commit()
    db.refresh(db_calculation)
    return db_calculation
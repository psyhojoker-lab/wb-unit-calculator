# backend/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import crud
import models
import schemas
import auth
from .database import SessionLocal, engine, get_db # Импортируем get_db из database
from .config import settings
from datetime import timedelta

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Зависимость для получения сессии БД - УБРАЛИ отсюда, теперь в database.py
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)): # Используем get_db из database
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)): # Используем get_db из database
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(auth.get_current_user)): # get_current_user теперь получает get_db из auth
    return current_user

@app.post("/calculations/", response_model=schemas.Calculation)
def create_calculation(calculation: schemas.CalculationCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)): # Используем get_db из database
    return crud.create_calculation(db=db, calculation=calculation, user_id=current_user.id)

@app.get("/calculations/", response_model=list[schemas.Calculation])
def read_calculations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)): # Используем get_db из database
    calculations = crud.get_calculations(db, skip=skip, limit=limit)
    return calculations
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, get_db
import models, schemas, auth
from typing import List
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Productivity & Finance API", description="Secured Web APIs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(email=user.email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/tasks", response_model=List[schemas.TaskResponse])
def get_tasks(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Task).filter(models.Task.user_id == current_user.id).all()

@app.post("/tasks", response_model=schemas.TaskResponse)
def create_task(task_data: schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_task = models.Task(**task_data.model_dump(), user_id=current_user.id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.get("/transactions", response_model=List[schemas.TransactionResponse])
def get_transactions(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Transaction).filter(models.Transaction.user_id == current_user.id).all()

@app.post("/transactions", response_model=schemas.TransactionResponse)
def create_transaction(txn_data: schemas.TransactionCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_txn = models.Transaction(**txn_data.model_dump(), user_id=current_user.id)
    db.add(new_txn)
    db.commit()
    db.refresh(new_txn)
    return new_txn

@app.get("/loans", response_model=List[schemas.LoanResponse])
def get_loans(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Loan).filter(models.Loan.user_id == current_user.id).all()

@app.post("/loans", response_model=schemas.LoanResponse)
def create_loan(loan_data: schemas.LoanCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    new_loan = models.Loan(**loan_data.model_dump(), user_id=current_user.id)
    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)
    return new_loan

@app.post("/api/agent")
def smart_agent(payload: dict, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    prompt = payload.get("prompt", "")
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")
    
    from agent import parse_natural_language
    result = parse_natural_language(prompt)
    
    new_obj = None
    if result["action"] == "create_task":
        new_obj = models.Task(**result["data"], user_id=current_user.id)
    elif result["action"] == "create_transaction":
        new_obj = models.Transaction(**result["data"], user_id=current_user.id)
    elif result["action"] == "create_loan":
        new_obj = models.Loan(**result["data"], user_id=current_user.id)
        
    if new_obj:
        db.add(new_obj)
        db.commit()
        db.refresh(new_obj)
        return {"status": "success", "message": f"Agent created a {result['action'].replace('create_', '')}", "data": new_obj}
    else:
        return {"status": "error", "message": "Agent could not determine action"}

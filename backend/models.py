from sqlalchemy import Column, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    tasks = relationship("Task", back_populates="owner")
    transactions = relationship("Transaction", back_populates="owner")
    loans = relationship("Loan", back_populates="owner")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    title = Column(String, index=True)
    category = Column(String)
    priority = Column(String)
    deadline = Column(String)
    status = Column(String, default="todo")
    
    owner = relationship("User", back_populates="tasks")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    type = Column(String) # income / expense
    category = Column(String)
    amount = Column(Float)
    transaction_date = Column(String)
    description = Column(String)

    owner = relationship("User", back_populates="transactions")

class Loan(Base):
    __tablename__ = "loans"
    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    type = Column(String) # borrowed / lent
    counterparty = Column(String)
    amount = Column(Float)
    interest_rate = Column(Float)
    start_date = Column(String)
    due_date = Column(String)
    status = Column(String, default="active")

    owner = relationship("User", back_populates="loans")

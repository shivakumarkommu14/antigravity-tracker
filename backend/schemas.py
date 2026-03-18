from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TaskBase(BaseModel):
    title: str
    category: Optional[str] = None
    priority: Optional[str] = "Medium"
    deadline: Optional[str] = None
    status: Optional[str] = "todo"
    
class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: str
    user_id: str
    model_config = ConfigDict(from_attributes=True)

class TransactionBase(BaseModel):
    type: str # 'income' or 'expense'
    category: Optional[str] = None
    amount: float
    transaction_date: Optional[str] = None
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: str
    user_id: str
    model_config = ConfigDict(from_attributes=True)

class LoanBase(BaseModel):
    type: str # 'borrowed' or 'lent'
    counterparty: str
    amount: float
    interest_rate: float = 0.0
    start_date: Optional[str] = None
    due_date: Optional[str] = None
    status: Optional[str] = "active"

class LoanCreate(LoanBase):
    pass

class LoanResponse(LoanBase):
    id: str
    user_id: str
    model_config = ConfigDict(from_attributes=True)

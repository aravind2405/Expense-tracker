# this file describes what an expense should look like
# i used it to make sure the data coming in has all the required fields
# the create model is for new expenses and the update model is for editing
# if something is missing FastAPI will reject it automatically

from pydantic import BaseModel
from typing import Optional


class ExpenseCreate(BaseModel):
    title: str
    category: str
    amount: float
    date: str
    description: Optional[str] = ""


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = None
    date: Optional[str] = None
    description: Optional[str] = None

# this is where all the expense API routes are defined
# i put create, read, update and delete all in one place to keep things organized
# every route now needs a logged in user so people only see their own expenses
# the serialize function converts MongoDB documents into a format the frontend can use

from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional
from bson import ObjectId
from database.connection import get_database
from models import ExpenseCreate, ExpenseUpdate
from routers.auth import get_current_user
from activity import log_activity


router = APIRouter()


def serialize(doc):
    return {
        "id": str(doc["_id"]),
        "title": doc["title"],
        "category": doc["category"],
        "amount": doc["amount"],
        "date": doc["date"],
        "description": doc.get("description", ""),
    }


@router.post("/")
async def create_expense(expense: ExpenseCreate, user: dict = Depends(get_current_user)):
    db = get_database()
    doc = expense.model_dump()
    doc["user_email"] = user["email"]
    result = await db.expenses.insert_one(doc)
    created = await db.expenses.find_one({"_id": result.inserted_id})
    await log_activity(user["email"], f"created expense '{expense.title}'")
    return serialize(created)


@router.get("/analytics/summary")
async def get_summary(user: dict = Depends(get_current_user)):
    db = get_database()
    email = user["email"]

    by_category = await db.expenses.aggregate([
        {"$match": {"user_email": email}},
        {"$group": {"_id": "$category", "total": {"$sum": "$amount"}, "count": {"$sum": 1}}},
        {"$sort": {"total": -1}}
    ]).to_list(100)

    grand_total = await db.expenses.aggregate([
        {"$match": {"user_email": email}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}, "count": {"$sum": 1}}}
    ]).to_list(1)

    return {
        "by_category": [
            {"category": r["_id"], "total": round(r["total"], 2), "count": r["count"]}
            for r in by_category
        ],
        "total_spent": round(grand_total[0]["total"], 2) if grand_total else 0,
        "total_entries": grand_total[0]["count"] if grand_total else 0
    }


@router.get("/")
async def get_expenses(
    category: Optional[str] = Query(None),
    month: Optional[str] = Query(None),
    user: dict = Depends(get_current_user)
):
    db = get_database()
    query = {"user_email": user["email"]}

    if category and category != "All":
        query["category"] = category

    if month:
        query["date"] = {"$regex": f"^{month}"}

    cursor = db.expenses.find(query).sort("date", -1)
    expenses = await cursor.to_list(500)
    return [serialize(e) for e in expenses]


@router.put("/{expense_id}")
async def update_expense(expense_id: str, update: ExpenseUpdate, user: dict = Depends(get_current_user)):
    db = get_database()
    existing = await db.expenses.find_one({"_id": ObjectId(expense_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Expense not found")
    if existing.get("user_email") != user["email"]:
        raise HTTPException(status_code=403, detail="Not allowed to edit this expense")

    data = {k: v for k, v in update.model_dump().items() if v is not None}
    await db.expenses.update_one({"_id": ObjectId(expense_id)}, {"$set": data})
    updated = await db.expenses.find_one({"_id": ObjectId(expense_id)})
    await log_activity(user["email"], "updated an expense")
    return serialize(updated)


@router.delete("/{expense_id}", status_code=204)
async def delete_expense(expense_id: str, user: dict = Depends(get_current_user)):
    db = get_database()
    existing = await db.expenses.find_one({"_id": ObjectId(expense_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Expense not found")
    if existing.get("user_email") != user["email"]:
        raise HTTPException(status_code=403, detail="Not allowed to delete this expense")

    await db.expenses.delete_one({"_id": ObjectId(expense_id)})
    await log_activity(user["email"], f"deleted an expense")
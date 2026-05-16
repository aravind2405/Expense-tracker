# Expense Tracker

# Project Summary

i made this app for my web technologies assignment. it lets you track your expenses by adding them with a title, amount, date, and category. you can filter expenses by category or month to see specific spending. there is also an analytics page that shows how much you spent in each category so you can see where your money went.

# Tech Stack

Frontend: React with Vite
Backend: FastAPI with Python
Database: MongoDB

# How to Run It

You need Node.js, Python 3, and MongoDB installed on your computer.

Start MongoDB first:

brew services start mongodb-community

Open a terminal and go to the backend folder:

cd backend
python3 -m pip install -r requirements.txt
uvicorn main:app --reload

Open another terminal and go to the frontend folder:

cd frontend
npm install
npm run dev

Open your browser and go to http://localhost:5173

# Loading Sample Data

If you want to test with some data already in it, run this:

mongoimport --db expense_tracker --collection expenses --file ../database/seed_data.json --jsonArray

# Folder Structure

backend folder:
main.py starts the server
models.py defines what an expense looks like
requirements.txt lists the Python packages
database folder has connection.py that connects to MongoDB
routers folder has expenses.py with all the API routes

frontend folder:
index.html is the main HTML file
package.json lists the Node packages
vite.config.js configures Vite
src folder has App.jsx which is the main component
components folder has ExpenseForm.jsx, ExpenseList.jsx, and Analytics.jsx
utils folder has api.js which talks to the backend
index.css has the styles

database folder:
seed_data.json has sample expenses for testing

# Features

Add a new expense with title, category, amount, date and description
Edit an existing expense
Delete an expense
Filter expenses by category
Filter expenses by month
View analytics showing spending by category

# API Endpoints

GET /api/expenses gets all expenses. you can add category or month to filter.
POST /api/expenses creates a new expense
PUT /api/expenses/{id} updates an expense
DELETE /api/expenses/{id} deletes an expense
GET /api/expenses/analytics/summary returns spending grouped by category

# Expense Categories

Food, Transport, Housing, Entertainment, Health, Shopping, Education, Utilities, Other
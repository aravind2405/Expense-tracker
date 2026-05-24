# Expense Tracker

## Project Summary

i made this app to track personal expenses. each user creates their own account and logs in, and they only see their own expenses. you can add an expense with a title, amount, date and category, edit it, or delete it. you can filter by category or month, and there is a live search that filters as you type. there is an analytics page that shows spending grouped by category. admin users get an extra panel where they can see all users and an activity log of what everyone has been doing.

## Tech Stack

Frontend: React with Vite
Backend: FastAPI with Python
Database: MongoDB
Authentication: JWT tokens with bcrypt password hashing

## Workload Allocation

i worked on this assignment individually. all files in this project were written by Aravind Danassegarane.

## How to Run It

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

## Creating an Admin User

new accounts are normal users by default. to make an account an admin, run this script from the backend folder and enter the email when it asks:

cd backend
python3 make_admin.py

after that, log out and log back in with that account to see the admin panel.

## Folder Structure

backend folder:
main.py starts the server
models.py defines what an expense and a user look like
activity.py is a helper that records user actions
make_admin.py is a script to turn a user into an admin
requirements.txt lists the Python packages
database folder has connection.py that connects to MongoDB
routers folder has expenses.py, auth.py and activity_routers.py with all the API routes

frontend folder:
index.html is the main HTML file
package.json lists the Node packages
vite.config.js configures Vite
src folder has App.jsx which is the main component
components folder has ExpenseForm.jsx, ExpenseList.jsx, Analytics.jsx, Login.jsx, Register.jsx and Admin.jsx
utils folder has api.js which talks to the backend
index.css has the styles

database folder:
seed_data.json has sample expenses for testing

## Features

Register a new account and log in
Each user only sees their own expenses
Add, edit and delete expenses
Filter expenses by category or month
Live search that filters expenses by title as you type
Analytics page showing spending by category
Admin panel to view all users and delete them
Activity log that records logins, registrations and expense changes

## Data Entities

The app has three data collections in MongoDB:
users stores account email, hashed password and role
expenses stores each expense and which user it belongs to
user_activity stores a log of what users did and when

## API Endpoints

Auth:
POST /api/auth/register creates a new account
POST /api/auth/login logs in and returns a JWT token
GET /api/auth/users lists all users, admin only
DELETE /api/auth/users/{email} deletes a user, admin only

Expenses (all require a logged in user):
GET /api/expenses gets the current user's expenses, you can add category or month to filter
POST /api/expenses creates a new expense
PUT /api/expenses/{id} updates an expense
DELETE /api/expenses/{id} deletes an expense
GET /api/expenses/analytics/summary returns spending grouped by category

Activity:
GET /api/activity returns the activity log, admin only

## Expense Categories

Food, Transport, Housing, Entertainment, Health, Shopping, Education, Utilities, Other
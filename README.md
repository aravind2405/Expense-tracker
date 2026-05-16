Expense Tracker

This is a simple web app I built for my web technologies assignment. It lets you keep track of your daily expenses. You can add a new expense, edit it if you made a mistake, or delete it when you no longer need it. You can also filter your expenses by category or by month. There is an analytics page that shows a summary of how much you spent in each category. I used React for the frontend, FastAPI with Python for the backend, and MongoDB as the database.

How to run it

Before you start you need Node.js, Python 3 and MongoDB installed on your computer. Start MongoDB first by running brew services start mongodb-community in your terminal. Then open a terminal, go into the backend folder with cd expense-tracker/backend and run python3 -m pip install -r requirements.txt to install the Python packages. Once that is done run uvicorn main:app --reload to start the backend. Open a second terminal, go into the frontend folder with cd expense-tracker/frontend and run npm install followed by npm run dev to start the frontend. Then open your browser and go to http://localhost:5173 and the app should be running.

Loading sample data

If you want to test the app with some data already in it you can run mongoimport --db expense_tracker --collection expenses --file database/seed_data.json --jsonArray to import the sample expenses into MongoDB.

How the project is organised

The backend folder has main.py which starts the server, models.py which defines what an expense looks like, requirements.txt which lists the Python packages, a database folder with connection.py that handles the MongoDB connection, and a routers folder with expenses.py that has all the API routes. The frontend folder has index.html, package.json, vite.config.js, and a src folder that contains App.jsx, main.jsx, index.css, a components folder with ExpenseForm.jsx, ExpenseList.jsx and Analytics.jsx, and a utils folder with api.js. The database folder has seed_data.json which is sample data for testing.

API endpoints

GET /api/expenses gets all expenses and you can pass category or month to filter the results. POST /api/expenses creates a new expense. PUT /api/expenses/id updates an existing expense. DELETE /api/expenses/id removes an expense. GET /api/expenses/analytics/summary returns the total spending grouped by category.

What an expense contains

Each expense has a title, a category, an amount, a date and an optional description. The categories you can choose from are Food, Transport, Housing, Entertainment, Health, Shopping, Education, Utilities and Other.

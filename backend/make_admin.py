# i made this small script to turn a normal user into an admin
# it is a one time thing you run from the terminal
# it asks for an email and sets that user's role to admin
# after running it that user can see the admin panel

import asyncio
from database.connection import connect_to_mongo, get_database, close_mongo_connection


async def make_admin():
    await connect_to_mongo()
    db = get_database()

    email = input("Enter the email to make admin: ").strip()

    result = await db.users.update_one(
        {"email": email},
        {"$set": {"role": "admin"}}
    )

    if result.matched_count == 0:
        print("No user found with that email.")
    else:
        print(f"{email} is now an admin.")

    await close_mongo_connection()


if __name__ == "__main__":
    asyncio.run(make_admin())
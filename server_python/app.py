import os

from flask import Flask, jsonify
from flask_cors import CORS

from dotenv import load_dotenv

load_dotenv()

from routes.auth import bp as auth_bp
from routes.bookings import bp as bookings_bp
from routes.visas import bp as visas_bp
from routes.reviews import bp as reviews_bp
from routes.wishlist import bp as wishlist_bp
from routes.admin import bp as admin_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

app.register_blueprint(auth_bp)
app.register_blueprint(bookings_bp)
app.register_blueprint(visas_bp)
app.register_blueprint(reviews_bp)
app.register_blueprint(wishlist_bp)
app.register_blueprint(admin_bp)


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


def seed():
    import bcrypt

    from db import users, bookings, visaApplications, now_iso

    admin_email = os.getenv("ADMIN_EMAIL", "admin@startours.com")
    admin_pass = os.getenv("ADMIN_PASSWORD", "admin123")
    if not users.find_one({"email": admin_email}):
        hashed = bcrypt.hashpw(admin_pass.encode("utf-8"), bcrypt.gensalt(12))
        users.insert_one(
            {
                "name": "Admin",
                "email": admin_email,
                "password": hashed.decode("utf-8"),
                "role": "admin",
                "createdAt": now_iso(),
            }
        )
        print(f"Admin seeded: {admin_email} / {admin_pass}")

    if not users.find_one({"email": "demo@test.com"}):
        hashed = bcrypt.hashpw(b"demo123", bcrypt.gensalt(12))
        user = users.insert_one(
            {
                "name": "Demo User",
                "email": "demo@test.com",
                "password": hashed.decode("utf-8"),
                "phone": "9876543210",
                "role": "user",
                "createdAt": now_iso(),
            }
        )
        uid = str(user.inserted_id)
        bookings.insert_one(
            {
                "user": uid,
                "name": "Demo User",
                "email": "demo@test.com",
                "destination": "Maldives – Overwater Paradise Escape",
                "days": 5,
                "people": 2,
                "date": "2026-08-15",
                "returnDate": "2026-08-20",
                "flight": "business",
                "hotelType": "5-star",
                "meal": "premium",
                "guider": "yes",
                "isInternational": True,
                "isLuxury": True,
                "costs": {
                    "travelFee": 75000,
                    "hotelFee": 50000,
                    "flightFee": 120000,
                    "restaurantFee": 25000,
                    "guiderFee": 15000,
                    "visaFee": 5000,
                    "luxuryFee": 30000,
                    "totalCost": 320000,
                },
                "status": "confirmed",
                "createdAt": now_iso(),
            }
        )
        visaApplications.insert_one(
            {
                "user": uid,
                "visaType": "Tourist",
                "country": "Maldives",
                "fullName": "Demo User",
                "email": "demo@test.com",
                "phone": "9876543210",
                "passport": "M1234567",
                "nationality": "Indian",
                "travelDates": "15 Aug 2026 – 20 Aug 2026",
                "status": "pending",
                "createdAt": now_iso(),
            }
        )
        print("Demo user seeded: demo@test.com / demo123")


if __name__ == "__main__":
    seed()
    port = int(os.getenv("PORT", 5000))
    print(f"Server running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)

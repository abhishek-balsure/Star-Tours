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
from routes.contacts import bp as contacts_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

app.register_blueprint(auth_bp)
app.register_blueprint(bookings_bp)
app.register_blueprint(visas_bp)
app.register_blueprint(reviews_bp)
app.register_blueprint(wishlist_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(contacts_bp)


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


def seed():
    import bcrypt

    from db import users

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
        print(f"Admin seeded: {admin_email}")


if __name__ == "__main__":
    seed()
    port = int(os.getenv("PORT", 5000))
    print(f"Server running on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)

import os
from functools import wraps

import jwt
from flask import jsonify, request

from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "star-tours-secret-key-2026")


def generate_token(user):
    payload = {
        "id": str(user["_id"]),
        "email": user.get("email"),
        "role": user.get("role", "user"),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def authenticate(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return jsonify({"error": "Authentication required"}), 401
        token = header.split(" ", 1)[1]
        try:
            decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            request.user = decoded
        except jwt.PyJWTError:
            return jsonify({"error": "Invalid or expired token"}), 401
        return fn(*args, **kwargs)

    return wrapper


def admin_only(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if getattr(request, "user", {}).get("role") != "admin":
            return jsonify({"error": "Admin access required"}), 403
        return fn(*args, **kwargs)

    return wrapper

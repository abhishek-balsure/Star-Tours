from flask import Blueprint, jsonify, request

import bcrypt

from middleware import generate_token, authenticate
from db import users, serialize, now_iso

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def safe_user(user):
    doc = serialize(user)
    doc.pop("password", None)
    return doc


@bp.post("/signup")
def signup():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400

    if users.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 400

    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(12))
    user = users.insert_one(
        {
            "name": name,
            "email": email,
            "password": hashed.decode("utf-8"),
            "phone": data.get("phone") or "",
            "role": "user",
            "createdAt": now_iso(),
        }
    )
    user = users.find_one({"_id": user.inserted_id})
    token = generate_token(user)
    return jsonify({"token": token, "user": safe_user(user)}), 201


@bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = users.find_one({"email": email})
    if not user or not bcrypt.checkpw(
        password.encode("utf-8"), user["password"].encode("utf-8")
    ):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_token(user)
    return jsonify({"token": token, "user": safe_user(user)})


@bp.get("/me")
@authenticate
def me():
    from bson import ObjectId

    user = users.find_one({"_id": ObjectId(request.user["id"])})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": safe_user(user)})

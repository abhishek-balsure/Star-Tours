from flask import Blueprint, jsonify, request

from bson import ObjectId

from middleware import authenticate, admin_only
from db import users, bookings, visaApplications, serialize

bp = Blueprint("admin", __name__, url_prefix="/api/admin")


def safe_user(user):
    doc = serialize(user)
    doc.pop("password", None)
    return doc


@bp.get("/stats")
@authenticate
@admin_only
def stats():
    user_count = users.count_documents({})
    booking_count = bookings.count_documents({})
    visa_count = visaApplications.count_documents({})
    recent_bookings = list(bookings.find({}).sort("createdAt", -1).limit(5))
    recent_visas = list(visaApplications.find({}).sort("createdAt", -1).limit(5))
    return jsonify(
        {
            "stats": {
                "users": user_count,
                "bookings": booking_count,
                "visas": visa_count,
            },
            "recentBookings": [serialize(b) for b in recent_bookings],
            "recentVisas": [serialize(v) for v in recent_visas],
        }
    )


@bp.get("/users")
@authenticate
@admin_only
def list_users():
    docs = list(users.find({}).sort("createdAt", -1))
    return jsonify({"users": [safe_user(u) for u in docs]})


@bp.delete("/users/<user_id>")
@authenticate
@admin_only
def delete_user(user_id):
    users.delete_one({"_id": ObjectId(user_id)})
    return jsonify({"message": "User deleted"})

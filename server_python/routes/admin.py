from flask import Blueprint, jsonify, request

from bson import ObjectId

from middleware import authenticate, admin_only
from db import (
    users,
    bookings,
    visaApplications,
    reviews,
    wishlistItems,
    contacts,
    serialize,
)

bp = Blueprint("admin", __name__, url_prefix="/api/admin")


def safe_user(user):
    doc = serialize(user)
    doc.pop("password", None)
    return doc


def _revenue():
    total = 0
    pending = 0
    for b in bookings.find({"status": {"$ne": "cancelled"}}):
        costs = b.get("costs") or {}
        total += costs.get("totalCost") or 0
        if b.get("status") == "pending":
            pending += 1
    return total, pending


@bp.get("/stats")
@authenticate
@admin_only
def stats():
    user_count = users.count_documents({})
    booking_count = bookings.count_documents({})
    visa_count = visaApplications.count_documents({})
    review_count = reviews.count_documents({})
    contact_count = contacts.count_documents({})
    wishlist_count = wishlistItems.count_documents({})
    cancelled = bookings.count_documents({"status": "cancelled"})
    revenue, pending_bookings = _revenue()
    pending_visas = visaApplications.count_documents({"status": "pending"})
    approved_visas = visaApplications.count_documents({"status": "approved"})
    recent_bookings = list(bookings.find({}).sort("createdAt", -1).limit(5))
    recent_visas = list(visaApplications.find({}).sort("createdAt", -1).limit(5))
    return jsonify(
        {
            "stats": {
                "users": user_count,
                "bookings": booking_count,
                "visas": visa_count,
                "reviews": review_count,
                "contacts": contact_count,
                "wishlist": wishlist_count,
                "cancelled": cancelled,
                "revenue": revenue,
                "pendingBookings": pending_bookings,
                "pendingVisas": pending_visas,
                "approvedVisas": approved_visas,
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


@bp.get("/reviews")
@authenticate
@admin_only
def list_reviews():
    docs = list(reviews.find({}).sort("createdAt", -1))
    return jsonify({"reviews": [serialize(d) for d in docs]})


@bp.delete("/reviews/<review_id>")
@authenticate
@admin_only
def delete_review(review_id):
    reviews.delete_one({"_id": ObjectId(review_id)})
    return jsonify({"message": "Review deleted"})

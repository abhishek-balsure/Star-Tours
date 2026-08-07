from flask import Blueprint, jsonify, request

from bson import ObjectId

from middleware import authenticate
from db import bookings, serialize, now_iso

bp = Blueprint("bookings", __name__, url_prefix="/api/bookings")


@bp.get("")
@authenticate
def list_bookings():
    role = request.user["role"]
    query = {} if role == "admin" else {"user": request.user["id"]}
    docs = list(bookings.find(query).sort("createdAt", -1))
    return jsonify({"bookings": [serialize(d) for d in docs]})


@bp.post("")
@authenticate
def create_booking():
    data = request.get_json(silent=True) or {}
    data["user"] = request.user["id"]
    data["status"] = "confirmed"
    data["createdAt"] = now_iso()
    result = bookings.insert_one(data)
    booking = bookings.find_one({"_id": result.inserted_id})
    return jsonify({"booking": serialize(booking)}), 201


@bp.put("/<booking_id>/cancel")
@authenticate
def cancel_booking(booking_id):
    booking = bookings.find_one({"_id": ObjectId(booking_id)})
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    if booking["user"] != request.user["id"] and request.user["role"] != "admin":
        return jsonify({"error": "Not authorized"}), 403
    bookings.update_one({"_id": ObjectId(booking_id)}, {"$set": {"status": "cancelled"}})
    updated = bookings.find_one({"_id": ObjectId(booking_id)})
    return jsonify({"booking": serialize(updated)})


@bp.put("/<booking_id>/status")
@authenticate
def update_booking_status(booking_id):
    if request.user["role"] != "admin":
        return jsonify({"error": "Admin only"}), 403
    data = request.get_json(silent=True) or {}
    bookings.update_one(
        {"_id": ObjectId(booking_id)}, {"$set": {"status": data.get("status")}}
    )
    booking = bookings.find_one({"_id": ObjectId(booking_id)})
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    return jsonify({"booking": serialize(booking)})


@bp.delete("/<booking_id>")
@authenticate
def delete_booking(booking_id):
    booking = bookings.find_one({"_id": ObjectId(booking_id)})
    if not booking:
        return jsonify({"error": "Booking not found"}), 404
    if booking["user"] != request.user["id"] and request.user["role"] != "admin":
        return jsonify({"error": "Not authorized"}), 403
    bookings.delete_one({"_id": ObjectId(booking_id)})
    return jsonify({"message": "Deleted"})

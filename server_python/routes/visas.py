from flask import Blueprint, jsonify, request

from bson import ObjectId

from middleware import authenticate
from db import visaApplications, serialize, now_iso

bp = Blueprint("visas", __name__, url_prefix="/api/visas")


@bp.get("")
@authenticate
def list_visas():
    role = request.user["role"]
    query = {} if role == "admin" else {"user": request.user["id"]}
    docs = list(visaApplications.find(query).sort("createdAt", -1))
    return jsonify({"visas": [serialize(d) for d in docs]})


@bp.post("")
@authenticate
def create_visa():
    data = request.get_json(silent=True) or {}
    data["user"] = request.user["id"]
    data["status"] = "pending"
    data["createdAt"] = now_iso()
    result = visaApplications.insert_one(data)
    visa = visaApplications.find_one({"_id": result.inserted_id})
    return jsonify({"visa": serialize(visa)}), 201


@bp.put("/<visa_id>/status")
@authenticate
def update_visa_status(visa_id):
    if request.user["role"] != "admin":
        return jsonify({"error": "Admin only"}), 403
    data = request.get_json(silent=True) or {}
    visaApplications.update_one(
        {"_id": ObjectId(visa_id)}, {"$set": {"status": data.get("status")}}
    )
    visa = visaApplications.find_one({"_id": ObjectId(visa_id)})
    if not visa:
        return jsonify({"error": "Visa not found"}), 404
    return jsonify({"visa": serialize(visa)})


@bp.delete("/<visa_id>")
@authenticate
def delete_visa(visa_id):
    visa = visaApplications.find_one({"_id": ObjectId(visa_id)})
    if not visa:
        return jsonify({"error": "Visa not found"}), 404
    if visa["user"] != request.user["id"] and request.user["role"] != "admin":
        return jsonify({"error": "Not authorized"}), 403
    visaApplications.delete_one({"_id": ObjectId(visa_id)})
    return jsonify({"message": "Deleted"})

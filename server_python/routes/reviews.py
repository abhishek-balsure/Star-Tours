from flask import Blueprint, jsonify, request

from bson import ObjectId

from middleware import authenticate
from db import reviews, users, serialize, now_iso

bp = Blueprint("reviews", __name__, url_prefix="/api/reviews")


@bp.get("")
def list_reviews():
    query = {}
    destination = request.args.get("destination")
    if destination:
        query["destination"] = destination
    docs = list(reviews.find(query).sort("createdAt", -1))
    return jsonify({"reviews": [serialize(d) for d in docs]})


@bp.post("")
@authenticate
def create_review():
    data = request.get_json(silent=True) or {}
    destination = data.get("destination")
    rating = data.get("rating")
    if not destination or rating is None:
        return jsonify({"error": "Destination and rating required"}), 400

    user = users.find_one({"_id": ObjectId(request.user["id"])})
    review = {
        "user": request.user["id"],
        "userName": user["name"] if user else "Anonymous",
        "destination": destination,
        "rating": int(rating),
        "comment": data.get("comment") or "",
        "createdAt": now_iso(),
    }
    result = reviews.insert_one(review)
    review["_id"] = result.inserted_id
    return jsonify({"review": serialize(review)}), 201

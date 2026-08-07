from flask import Blueprint, jsonify, request

from middleware import authenticate
from db import wishlistItems

bp = Blueprint("wishlist", __name__, url_prefix="/api/wishlist")


@bp.get("")
@authenticate
def get_wishlist():
    items = list(wishlistItems.find({"user": request.user["id"]}))
    return jsonify({"wishlist": [i["destination"] for i in items]})


@bp.post("")
@authenticate
def add_wishlist():
    data = request.get_json(silent=True) or {}
    destination = data.get("destination")
    if not destination:
        return jsonify({"error": "Destination required"}), 400
    if wishlistItems.find_one({"user": request.user["id"], "destination": destination}):
        return jsonify({"error": "Already in wishlist"}), 400
    wishlistItems.insert_one(
        {"user": request.user["id"], "destination": destination}
    )
    return jsonify({"message": "Added"}), 201


@bp.delete("/<destination>")
@authenticate
def remove_wishlist(destination):
    wishlistItems.delete_many({"user": request.user["id"], "destination": destination})
    return jsonify({"message": "Removed"})

from flask import Blueprint, jsonify, request

from middleware import authenticate, admin_only
from db import contacts, serialize, now_iso

bp = Blueprint("contacts", __name__, url_prefix="/api/contacts")


@bp.post("")
def create_contact():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    subject = (data.get("subject") or "").strip()
    message = (data.get("message") or "").strip()

    if not name or name and len(name) < 2:
        return jsonify({"error": "Please enter your name"}), 400
    if not email or "@" not in email or "." not in email:
        return jsonify({"error": "Please enter a valid email"}), 400
    if not message or len(message) < 5:
        return jsonify({"error": "Please enter a message (at least 5 characters)"}), 400

    doc = {
        "name": name,
        "email": email,
        "subject": subject,
        "message": message,
        "createdAt": now_iso(),
    }
    result = contacts.insert_one(doc)
    doc["_id"] = result.inserted_id
    return jsonify({"contact": serialize(doc)}), 201


@bp.get("")
@authenticate
@admin_only
def list_contacts():
    docs = list(contacts.find({}).sort("createdAt", -1))
    return jsonify({"contacts": [serialize(d) for d in docs]})


@bp.delete("/<contact_id>")
@authenticate
@admin_only
def delete_contact(contact_id):
    from bson import ObjectId

    contacts.delete_one({"_id": ObjectId(contact_id)})
    return jsonify({"message": "Deleted"})

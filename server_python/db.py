import os
from datetime import datetime

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/startours")
DB_NAME = os.getenv("MONGODB_DB", "startours")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

users = db.users
bookings = db.bookings
visaApplications = db.visaApplications
reviews = db.reviews
wishlistItems = db.wishlistItems
contacts = db.contacts


def serialize(doc):
    """Convert a MongoDB document to a JSON-safe dict."""
    if doc is None:
        return None
    out = {}
    for key, value in doc.items():
        if key == "_id":
            out[key] = str(value)
        elif isinstance(value, dict):
            out[key] = serialize(value)
        elif isinstance(value, list):
            out[key] = [serialize(v) if isinstance(v, dict) else v for v in value]
        elif isinstance(value, datetime):
            out[key] = value.isoformat()
        else:
            out[key] = value
    return out


def now_iso():
    return datetime.utcnow().isoformat()

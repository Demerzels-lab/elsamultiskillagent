import requests
import sys
import json
from datetime import datetime
import os

class GoogleMapsElite:
    """
    Elite Google Maps integration for OpenClaw.
    Supports Places API (New), Details, and Distance Matrix.
    """
    def __init__(self):
        # Support multiple env var names for flexibility
        self.api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GOOGLE_MAPS_API_KEY")
        self.base_url = "https://maps.googleapis.com/maps/api"

    def _validate_key(self):
        if not self.api_key:
            print(json.dumps({"error": "Missing API key. Set GOOGLE_API_KEY environment variable."}))
            sys.exit(1)

    def search(self, query, location="32.0684,34.7905", radius=2000, open_now=False, language="he"):
        self._validate_key()
        url = f"{self.base_url}/place/textsearch/json"
        params = {
            "query": query, "location": location, "radius": radius,
            "key": self.api_key, "language": language
        }
        if open_now: params["opennow"] = "true"
        res = requests.get(url, params=params).json()
        results = res.get("results", [])[:5]
        
        for place in results:
            if place.get("photos"):
                photo_ref = place["photos"][0]["photo_reference"]
                place["photo_url"] = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_ref}&key={self.api_key}"
        return results

    def details(self, place_id, language="he"):
        self._validate_key()
        url = f"{self.base_url}/place/details/json"
        params = {
            "place_id": place_id, "key": self.api_key, "language": language,
            "fields": "name,opening_hours,formatted_phone_number,rating,formatted_address,reviews,url,price_level,photos,vicinity"
        }
        res = requests.get(url, params=params).json().get("result", {})
        if res.get("photos"):
            photo_ref = res["photos"][0]["photo_reference"]
            res["photo_url"] = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference={photo_ref}&key={self.api_key}"
        return res

    def distance(self, origin, destination, mode="driving", language="he"):
        self._validate_key()
        url = f"{self.base_url}/distancematrix/json"
        params = {
            "origins": origin, "destinations": destination, "mode": mode,
            "departure_time": "now", "key": self.api_key, "language": language
        }
        res = requests.get(url, params=params).json()
        if res.get("status") == "OK":
            element = res["rows"][0]["elements"][0]
            if element.get("status") == "OK":
                return {
                    "distance": element["distance"]["text"],
                    "duration": element["duration"]["text"],
                    "duration_in_traffic": element.get("duration_in_traffic", {}).get("text", element["duration"]["text"])
                }
        return {"error": "Could not calculate distance"}

if __name__ == "__main__":
    if len(sys.argv) < 2: sys.exit(1)
    action = sys.argv[1]
    elite = GoogleMapsElite()
    lang = "he"
    for arg in sys.argv:
        if arg.startswith("--lang="): lang = arg.split("=")[1]

    if action == "search":
        print(json.dumps(elite.search(sys.argv[2], open_now="--open" in sys.argv, language=lang), ensure_ascii=False))
    elif action == "details":
        print(json.dumps(elite.details(sys.argv[2], language=lang), ensure_ascii=False))
    elif action == "distance":
        mode = sys.argv[4] if len(sys.argv) > 4 else "driving"
        print(json.dumps(elite.distance(sys.argv[2], sys.argv[3], mode, language=lang), ensure_ascii=False))

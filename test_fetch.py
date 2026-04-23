import requests
import json

def fetch_football_data():
    url = "https://free-api-live-football-data.p.rapidapi.com/football-get-matches-by-date?date=20260515"
    headers = {
        'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
        'x-rapidapi-key': '460c308d63mshf7ee5878584aeccp1379d4jsndb92834e9c1e'
    }
    response = requests.get(url, headers=headers, timeout=5)
    data = response.json()
    raw_matches = data.get("response", {}).get("matches", [])
    matches = []
    for rm in raw_matches:
        matches.append({
            "id": rm["id"],
            "homeTeam": {"name": rm["home"]["name"]},
            "awayTeam": {"name": rm["away"]["name"]},
            "utcDate": rm["status"]["utcTime"],
            "status": "FINISHED", # mock it to finished for settling
            "score": {
                "fullTime": {"home": rm["home"]["score"] + 2, "away": rm["away"]["score"] + 1} # mock scores
            }
        })
    return {"matches": matches}

print(json.dumps(fetch_football_data()["matches"][:2], indent=2))

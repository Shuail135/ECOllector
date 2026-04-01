# ECOllector

ECOllector is a recycling-sorting system made up of three connected parts:

- `camera_ai`: the camera-side classifier that writes detection events into Firebase Realtime Database
- `ecollector-frontend`: the main live dashboard application
- `mvp-webpage`: the product / marketing webpage with a live dashboard preview backed by the same Firebase data

## System Flow

1. The camera pipeline classifies material events.
2. `camera_ai/Firebase.py` writes the latest event to `detections/current`.
3. The same service appends each event to `detections/history`.
4. The frontends read from Firebase Realtime Database and render live operational state.

Current Firebase paths used by the system:

- `detections/current`
- `detections/history`
- `summary/totalsByType` (optional in the MVP webpage)
- `summary/lastResetTimestamp` (optional in the MVP webpage)

## Repository Structure

### `camera_ai`

Python-side detection writer and Firebase bridge.

Important files:

- [`camera_ai/Firebase.py`](/D:/ECOllector/camera_ai/Firebase.py)
- `camera_ai/test_with_GUI.py`
- `camera_ai/waste3_best.pt`

`camera_ai/Firebase.py` currently writes:

- `type`
- `confidence`
- `timestampOttawa`
- `timestamp`

If you want richer live dashboard fields such as routing, latency, or classifier state, those values need to be written into Firebase here as well.

### `ecollector-frontend`

The main live dashboard application.

Run locally:

```bash
cd ecollector-frontend
npm install
npm run dev
```

Build:

```bash
npm run build
```

### `mvp-webpage`

The Vite + React marketing / MVP webpage with a Firebase-backed dashboard preview.

Run locally:

```bash
cd mvp-webpage
npm install
npm run dev
```

Build:

```bash
npm run build
```

## MVP Webpage Notes

The dashboard preview in `mvp-webpage` is connected to Firebase Realtime Database and is designed to:

- show live counts from database totals when available
- derive counts from `detections/history` when summary totals are missing
- show current classification from `detections/current`
- render recent classification activity from `detections/history`
- surface Firebase read errors in the UI instead of silently falling back

When Firebase is configured, the dashboard avoids inventing live values for routing, latency, or state. If those fields are not present in the database, the UI shows them as unavailable.

Environment setup:

1. Copy `mvp-webpage/.env.example` to `mvp-webpage/.env`
2. Fill in the Firebase web config values

The current project uses this Realtime Database URL:

```env
VITE_FIREBASE_DATABASE_URL=https://ecollector-59983-default-rtdb.firebaseio.com
```

## Firebase Rules

For browser-based reads to work in both frontends, Realtime Database rules must allow access to the paths above. If reads are blocked, the MVP webpage will show a Firebase read error state in the dashboard preview.

## Recent MVP Updates

- Added Firebase-backed dashboard preview in `mvp-webpage`
- Connected the preview to the live ECOllector Realtime Database
- Improved dashboard hierarchy, copy, and motion
- Added explicit live / error / demo source states
- Refined the page background gradient and final CTA motion

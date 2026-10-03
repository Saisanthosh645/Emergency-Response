# Lifeline India 🇮🇳
### Hyperlocal Emergency Response Platform with AI Triage & Sub-60s Dispatch

**Live Pitch Story:** *"From emergency to responder in under 60 seconds."*

Lifeline India is an installable, progressive web application (PWA) built for high-density metropolitan emergency response, centered on **Hyderabad, Telangana**. It integrates citizen mobile SOS, responder turn-by-turn dispatch, and desktop command center coordination with **Gemini AI multimodal triage** and a **Good Samaritan Community Network**.

---

## 🏛️ System Architecture Diagram

```
                             ┌────────────────────────────────┐
                             │       CITIZEN APP (PWA)        │
                             │  - 2-sec SOS / Silent Triple   │
                             │  - GPS Precision & Offline SMS │
                             │  - Multilingual Speech (EN/HI/TE)
                             └───────────────┬────────────────┘
                                             │
                          REST / WebSocket / BroadcastChannel
                                             │
                                             ▼
                             ┌────────────────────────────────┐
                             │     CENTRAL DISPATCH ENGINE    │
                             │    (server.ts / Express API)   │
                             └───────┬──────────────┬─────────┘
                                     │              │
                   ┌─────────────────┴────┐   ┌─────┴──────────────────┐
                   ▼                      │   ▼                        │
         ┌──────────────────┐             │  ┌───────────────────────┐ │
         │  GEMINI 3.8 AI   │             │  │   SMART DISPATCH      │ │
         │  - Triage Matrix │             │  │   SCORING ENGINE      │ │
         │  - Multilingual  │             │  │   • Distance (40%)    │ │
         │    First Aid     │             │  │   • ETA (25%)         │ │
         │  - SitRep Engine │             │  │   • Availability (25%)│ │
         │  - Fraud & Dedup │             │  │   • Skill Match (20%) │ │
         └──────────────────┘             │  └───────────────────────┘ │
                                          │                            │
                     ┌────────────────────┴───────────────┐            │
                     ▼                                    ▼            ▼
      ┌───────────────────────────────┐    ┌──────────────────────────────┐
      │     RESPONDER TERMINAL        │    │    COMMAND CENTER DASHBOARD  │
      │  - 30s Siren Alert Timer      │    │  - Clustered Dark Heatmap    │
      │  - Turn-by-Turn Route Polyline│    │  - Geofenced Area Broadcasts │
      │  - 1-Tap Status Roll-Out      │    │  - Auto-Escalation SLA       │
      │  - Hospital ICU Reservation   │    │  - "Simulate City" Pulse     │
      └───────────────────────────────┘    └──────────────────────────────┘
                     ▲                                    ▲
                     └────────────────┬───────────────────┘
                                      │
                         ┌────────────┴─────────────┐
                         │   10 HYDERABAD HOSPITALS │
                         │   - Live ICU Bed Reserve │
                         │   - Blood Bank Units     │
                         │   - Level-1 Trauma Hubs  │
                         └──────────────────────────┘
```

---

## 🚀 Key Features

### 1. Citizen Mobile App
- **Giant SOS Button**: 2-second hold with haptic feedback, audio countdown ticks, and animated circular SVG progress.
- **Silent SOS (Triple Tap)**: Discretely broadcasts coordinates for women's safety or threat situations without audio/visual giveaway.
- **GPS Precision**: Auto-captures latitude/longitude with accuracy radius and manual pin adjustment for known Hyderabad landmarks.
- **Gemini AI Multilingual Triage**: Speech-to-text input in English, Hindi (हिन्दी), and Telugu (తెలుగు) returning clinical severity rating, responder recommendations, and 3 step-by-step immediate first-aid instructions.
- **Live Real-time Tracking**: Dynamic Leaflet route tracking with vehicle speed, remaining ETA, 6-step status timeline, masked calling, and WhatsApp coordinate sharing.
- **Offline / Low-Connectivity Mode**: Stores SOS locally with simulated SMS gateway fallback (`112 GATEWAY`).

### 2. Responder Terminal
- **Duty Toggle**: Instant On-Duty / Offline availability toggle.
- **Incoming 30-Second Siren**: Web Audio API emergency siren alarm with 30s accept/decline countdown.
- **Tactical Navigation**: Route polyline on Leaflet dark map with live ETA.
- **One-Tap Mission Progression**: `Assigned` → `En Route` → `Arrived on Scene` → `Hospital Handover` → `Resolved`.
- **Hospital-Aware Routing**: Direct reservation to nearest hospital with verified ICU & trauma bed availability.

### 3. Command Center (Desktop Control-Room UI)
- **Leaflet Dark Matter Map**: Incident severity markers, responder fleet markers, and heatmap density overlay.
- **Smart Dispatch Matrix**: Multi-factor scoring function with score breakdown and manual override.
- **Auto-Escalation (60s SLA)**: Unassigned critical tickets automatically widen search radius and alert the zonal supervisor.
- **Geofenced Area Warning Broadcaster**: Draw/set kilometer radius to broadcast flood, fire, or road closure warnings to citizens within the zone.
- **Simulate City**: 1-click generator that spawns realistic incidents across Hyderabad, moving responders dynamically.
- **AI Situation Report (SitRep)**: Gemini-generated daily executive briefings, exportable to CSV/PDF.
- **Good Samaritan Network**: Over 40 responders seeded including CPR-certified volunteers and rare blood donors.

---

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion
- **Maps**: Leaflet + OpenStreetMap CartoDB Dark Matter (Zero API key required)
- **AI**: Gemini 3.8 Flash via `@google/genai` TypeScript SDK (server-side proxy)
- **Audio Engine**: Pure Web Audio API synthesizer for sirens, countdown ticks, and chimes
- **Real-Time Mesh**: `BroadcastChannel` + `localStorage` cross-tab synchronizer
- **PWA**: `vite-plugin-pwa` with service worker, web manifest, and install prompts

---

## 📦 Running Locally
```bash
# 1. Install dependencies
npm install

# 2. Start full-stack development server
npm run dev

# 3. Build for production
npm run build
npm start
```

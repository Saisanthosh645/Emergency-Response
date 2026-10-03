import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Incident, Responder, Hospital, AreaAlert } from '../../types';
import { Plus, Minus, Navigation } from 'lucide-react';

interface EmergencyMapProps {
  incidents?: Incident[];
  responders?: Responder[];
  hospitals?: Hospital[];
  areaAlerts?: AreaAlert[];
  selectedIncident?: Incident | null;
  selectedResponder?: Responder | null;
  onSelectIncident?: (incident: Incident) => void;
  onSelectResponder?: (responder: Responder) => void;
  userLocation?: { lat: number; lng: number; accuracy?: number };
  onMapClick?: (coords: { lat: number; lng: number }) => void;
  center?: [number, number];
  zoom?: number;
  showHeatmap?: boolean;
  interactive?: boolean;
  className?: string;
  drawRoute?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Satellite tile URL (ESRI World Imagery — no API key needed, free, global)
// ─────────────────────────────────────────────────────────────────────────────
const SATELLITE_TILE =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

// Minimal road label overlay (subtle, monochrome)
const LABEL_TILE =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';

export const EmergencyMap: React.FC<EmergencyMapProps> = ({
  incidents = [],
  responders = [],
  hospitals = [],
  areaAlerts = [],
  selectedIncident,
  selectedResponder,
  onSelectIncident,
  onSelectResponder,
  userLocation,
  onMapClick,
  center = [17.4215, 78.4310],
  zoom = 13,
  interactive = true,
  className = 'w-full h-full',
  drawRoute = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{
    markers: L.LayerGroup;
    routes: L.LayerGroup;
    halos: L.LayerGroup;
    alerts: L.LayerGroup;
  } | null>(null);

  // ── Init map (once) ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: false,
      dragging: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      attributionControl: false,
    });

    // Satellite base layer
    L.tileLayer(SATELLITE_TILE, { maxZoom: 19 }).addTo(map);

    // Subtle label overlay on top
    L.tileLayer(LABEL_TILE, {
      maxZoom: 19,
      opacity: 0.65,
    }).addTo(map);

    const alertsGroup = L.layerGroup().addTo(map);
    const halosGroup = L.layerGroup().addTo(map);
    const routesGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    layersRef.current = {
      markers: markersGroup,
      routes: routesGroup,
      halos: halosGroup,
      alerts: alertsGroup,
    };
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // ── Map click ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !onMapClick) return;
    const handler = (e: L.LeafletMouseEvent) => onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    map.on('click', handler);
    return () => { map.off('click', handler); };
  }, [onMapClick]);

  // ── Recenter ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  }, [center[0], center[1], zoom]);

  // ── Render markers (minimal, clean) ───────────────────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layers = layersRef.current;
    if (!map || !layers) return;

    layers.markers.clearLayers();
    layers.routes.clearLayers();
    layers.halos.clearLayers();
    layers.alerts.clearLayers();

    // ── 1. Area alerts ──────────────────────────────────────────────────────
    areaAlerts.forEach(alert => {
      if (!alert.active) return;
      L.circle([alert.center.lat, alert.center.lng], {
        radius: (alert.radiusKm || 1) * 1000,
        color: '#f59e0b',
        fillColor: '#fbbf24',
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '8 6',
      }).addTo(layers.alerts);
    });

    // ── 2. User location ────────────────────────────────────────────────────
    if (userLocation?.lat && userLocation?.lng) {
      const uc: [number, number] = [userLocation.lat, userLocation.lng];
      L.circle(uc, {
        radius: userLocation.accuracy || 30,
        color: '#38bdf8',
        fillColor: '#38bdf8',
        fillOpacity: 0.18,
        weight: 1,
      }).addTo(layers.halos);

      L.marker(uc, {
        icon: L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;border-radius:50%;background:#38bdf8;border:2px solid white;box-shadow:0 0 0 4px rgba(56,189,248,.25)"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        }),
      }).addTo(layers.markers);
    }

    // ── 3. Incidents — clean dot + small label on hover/selected ───────────
    // Limit to first 8 most critical to keep map readable
    const sorted = [...incidents]
      .filter(i => i.location?.lat && i.location?.lng)
      .sort((a, b) => {
        const order: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Moderate: 3, Low: 4 };
        return (order[a.severity] ?? 5) - (order[b.severity] ?? 5);
      })
      .slice(0, 8);

    sorted.forEach(inc => {
      const coords: [number, number] = [inc.location.lat, inc.location.lng];
      const isSelected = selectedIncident?.id === inc.id;

      const colorMap: Record<string, string> = {
        Critical: '#ef4444', High: '#f97316', Medium: '#eab308', Moderate: '#eab308', Low: '#3b82f6',
      };
      const col = colorMap[inc.severity] ?? '#ef4444';

      // Subtle halo — only for selected or critical
      if (isSelected || inc.severity === 'Critical') {
        L.circle(coords, {
          radius: isSelected ? 350 : 220,
          color: col,
          fillColor: col,
          fillOpacity: 0.12,
          weight: 1,
          dashArray: '4 4',
        }).addTo(layers.halos);
      }

      // Icon: solid circle dot, no floating text label (show on select only)
      const typeEmoji: Record<string, string> = {
        Fire: '🔥', Accident: '🚗', Medical: '🏥', Crime: '🚨', 'Women Safety': '🛡️',
      };
      const emoji = typeEmoji[inc.type] ?? '❗';

      const html = isSelected
        ? `<div style="display:flex;flex-direction:column;align-items:center;gap:3px">
            <div style="background:white;color:#0f172a;font-size:9px;font-weight:700;padding:2px 7px;border-radius:12px;border:1px solid rgba(0,0,0,.1);box-shadow:0 2px 8px rgba(0,0,0,.25);white-space:nowrap;font-family:sans-serif">
              ${inc.type} · ${inc.severity}
            </div>
            <div style="width:28px;height:28px;border-radius:50%;background:${col};border:2.5px solid white;box-shadow:0 3px 10px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;font-size:13px">
              ${emoji}
            </div>
          </div>`
        : `<div style="width:20px;height:20px;border-radius:50%;background:${col};border:2px solid rgba(255,255,255,.85);box-shadow:0 2px 8px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;font-size:10px">
            ${emoji}
          </div>`;

      const m = L.marker(coords, {
        icon: L.divIcon({
          className: '',
          html,
          iconSize: isSelected ? [28, 52] : [20, 20],
          iconAnchor: isSelected ? [14, 52] : [10, 10],
        }),
        zIndexOffset: isSelected ? 1000 : 0,
      }).addTo(layers.markers);
      m.on('click', () => onSelectIncident?.(inc));
    });

    // ── 4. Responders — tiny icon dots, label only on selected ─────────────
    // Show only on-duty or en-route responders, max 6
    const activeResponders = responders
      .filter(r => r.location?.lat && r.location?.lng && r.status !== 'Off Duty')
      .slice(0, 6);

    activeResponders.forEach(resp => {
      const rc: [number, number] = [resp.location.lat, resp.location.lng];
      const isSelected = selectedResponder?.id === resp.id;

      const respColorMap: Record<string, string> = {
        'ALS Ambulance': '#2563eb', 'BLS Ambulance': '#1d4ed8',
        'Fire Tender': '#ea580c', 'Police PCR': '#4f46e5',
        'Doctor Volunteer': '#059669', 'Blood Donor': '#dc2626',
        'SDRF Boat': '#0284c7', 'BLUE CROSS': '#7c3aed',
      };
      const col = respColorMap[resp.type] ?? '#2563eb';
      const isEnRoute = resp.status === 'En Route' || resp.status === 'Dispatched';

      const html = isSelected
        ? `<div style="display:flex;flex-direction:column;align-items:center;gap:3px">
            <div style="background:rgba(0,0,0,.75);color:white;font-size:8px;font-weight:700;padding:2px 6px;border-radius:10px;white-space:nowrap;font-family:monospace;">
              ${resp.callSign}
            </div>
            <div style="width:22px;height:22px;border-radius:50%;background:${col};border:2.5px solid white;box-shadow:0 3px 10px rgba(0,0,0,.4)"></div>
          </div>`
        : `<div style="width:14px;height:14px;border-radius:50%;background:${col};border:1.5px solid rgba(255,255,255,.9);box-shadow:0 1px 4px rgba(0,0,0,.3)${isEnRoute ? ';animation:pulse 1s infinite' : ''}"></div>`;

      const rm = L.marker(rc, {
        icon: L.divIcon({
          className: '',
          html,
          iconSize: isSelected ? [22, 44] : [14, 14],
          iconAnchor: isSelected ? [11, 44] : [7, 7],
        }),
        zIndexOffset: isSelected ? 900 : 0,
      }).addTo(layers.markers);
      rm.on('click', () => onSelectResponder?.(resp));
    });

    // ── 5. Hospitals — small H badge, no text labels ────────────────────────
    hospitals.slice(0, 6).forEach(hosp => {
      if (!hosp.location?.lat || !hosp.location?.lng) return;
      const hc: [number, number] = [hosp.location.lat, hosp.location.lng];
      const hasICU = hosp.availableIcuBeds > 0;

      L.marker(hc, {
        icon: L.divIcon({
          className: '',
          html: `<div style="width:18px;height:18px;border-radius:4px;background:${hasICU ? '#10b981' : '#6b7280'};border:1.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;color:white;font-size:9px;font-weight:900;font-family:sans-serif">H</div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
        interactive: false,
      }).addTo(layers.markers);
    });

    // ── 6. Route ────────────────────────────────────────────────────────────
    if (drawRoute) {
      const routedInc = selectedIncident || incidents.find(i => i.routePolyline?.length);
      if (routedInc?.location) {
        let routeCoords: [number, number][] = [];

        if (routedInc.routePolyline?.length > 1) {
          routeCoords = routedInc.routePolyline;
        } else if (routedInc.assignedResponder?.location) {
          const rp: [number, number] = [routedInc.assignedResponder.location.lat, routedInc.assignedResponder.location.lng];
          const ip: [number, number] = [routedInc.location.lat, routedInc.location.lng];
          routeCoords = [
            rp,
            [rp[0] + (ip[0] - rp[0]) * 0.33, rp[1] + (ip[1] - rp[1]) * 0.25],
            [rp[0] + (ip[0] - rp[0]) * 0.66, rp[1] + (ip[1] - rp[1]) * 0.75],
            ip,
          ];
        }

        if (routeCoords.length >= 2) {
          // Glow
          L.polyline(routeCoords, { color: '#ef4444', weight: 8, opacity: 0.2 }).addTo(layers.routes);
          // Main line
          L.polyline(routeCoords, { color: '#ef4444', weight: 3, opacity: 0.9, dashArray: '10 6' }).addTo(layers.routes);
        }
      }
    }

  }, [incidents, responders, hospitals, areaAlerts, selectedIncident, selectedResponder, userLocation, drawRoute]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleLocate = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (userLocation?.lat) map.setView([userLocation.lat, userLocation.lng], 15, { animate: true });
    else if (selectedIncident?.location) map.setView([selectedIncident.location.lat, selectedIncident.location.lng], 15, { animate: true });
    else map.setView(center, 13, { animate: true });
  };

  return (
    <div className={`relative isolate z-0 ${className} overflow-hidden rounded-2xl`}>
      <div ref={containerRef} className="w-full h-full min-h-[460px]" />

      {/* Live badge — top left, minimal dark pill */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono font-bold text-white/90 border border-white/10 shadow">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        LIVE · HYD GRID
      </div>

      {/* Zoom controls — right side, dark glass */}
      <div className="absolute bottom-6 right-3 z-[400] flex flex-col gap-px">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-t-xl bg-black/50 backdrop-blur-sm border border-white/15 text-white/90 hover:bg-black/70 flex items-center justify-center transition"
          title="Zoom In"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-b-xl bg-black/50 backdrop-blur-sm border border-white/15 border-t-0 text-white/90 hover:bg-black/70 flex items-center justify-center transition"
          title="Zoom Out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleLocate}
          className="w-8 h-8 mt-1 rounded-xl bg-black/50 backdrop-blur-sm border border-white/15 text-white/90 hover:bg-black/70 flex items-center justify-center transition"
          title="Center"
        >
          <Navigation className="w-3.5 h-3.5 -rotate-45" />
        </button>
      </div>

      {/* Minimal legend — bottom left */}
      <div className="absolute bottom-3 left-3 z-[400] flex items-center gap-3 rounded-xl bg-black/50 backdrop-blur-sm px-3 py-1.5 text-[9px] font-mono text-white/70 border border-white/10">
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />INC</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />UNIT</div>
        <div className="flex items-center gap-1"><span className="w-2 h-1.5 rounded-sm bg-emerald-500" />HOSP</div>
      </div>
    </div>
  );
};

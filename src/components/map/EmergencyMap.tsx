import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Incident, Responder, Hospital, AreaAlert } from '../../types';
import { Layers, Plus, Minus, Navigation, MapPin } from 'lucide-react';

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
  center = [17.4215, 78.4310], // Default center around Banjara Hills / Hitech City corridor
  zoom = 14,
  interactive = true,
  className = 'w-full h-full',
  drawRoute = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{
    markers: L.LayerGroup;
    routes: L.LayerGroup;
    pois: L.LayerGroup;
    halos: L.LayerGroup;
    alerts: L.LayerGroup;
  } | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: false,
      dragging: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      attributionControl: false,
    });

    // Clean OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: 'abc',
    }).addTo(map);

    const alertsGroup = L.layerGroup().addTo(map);
    const halosGroup = L.layerGroup().addTo(map);
    const routesGroup = L.layerGroup().addTo(map);
    const poisGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    layersRef.current = {
      markers: markersGroup,
      routes: routesGroup,
      pois: poisGroup,
      halos: halosGroup,
      alerts: alertsGroup,
    };

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Map Click Listener
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !onMapClick) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [onMapClick]);

  // Update center when changed
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  }, [center[0], center[1], zoom]);

  // Render Markers and Features DYNAMICALLY
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layers = layersRef.current;
    if (!map || !layers) return;

    layers.markers.clearLayers();
    layers.routes.clearLayers();
    layers.pois.clearLayers();
    layers.halos.clearLayers();
    layers.alerts.clearLayers();

    // 1. POI Landmarks
    const landmarks = [
      { name: 'Apollo Hospitals\nJubilee Hills', lat: 17.4319, lng: 78.4073, type: 'hospital' },
      { name: 'Care Hospital\nBanjara Hills', lat: 17.4156, lng: 78.4350, type: 'hospital' },
      { name: 'Banjara Hills\nPolice Station', lat: 17.4180, lng: 78.4410, type: 'police' },
      { name: 'GVK One Mall', lat: 17.4200, lng: 78.4480, type: 'mall' },
      { name: 'Cyber Towers\nHitech City', lat: 17.4504, lng: 78.3808, type: 'landmark' },
    ];

    landmarks.forEach(poi => {
      let iconColor = '#ef4444';
      let iconSvg = `<path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>`;
      if (poi.type === 'police') {
        iconColor = '#3b82f6';
        iconSvg = `<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>`;
      } else if (poi.type === 'mall') {
        iconColor = '#0284c7';
        iconSvg = `<path d="M16 6V4a4 4 0 00-8 0v2H4v14a2 2 0 002 2h12a2 2 0 002-2V6h-4zm-6-2a2 2 0 014 0v2h-4V4z"/>`;
      } else if (poi.type === 'landmark') {
        iconColor = '#8b5cf6';
        iconSvg = `<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>`;
      }

      const poiIcon = L.divIcon({
        className: 'custom-poi-marker',
        html: `
          <div class="flex items-center gap-1.5 pointer-events-none select-none">
            <div class="w-5 h-5 rounded-full flex items-center justify-center text-white shadow-sm" style="background-color: ${iconColor}">
              <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">${iconSvg}</svg>
            </div>
            <div class="text-[10px] font-bold text-slate-700 leading-tight whitespace-pre drop-shadow-sm font-sans bg-white/80 px-1 py-0.5 rounded border border-slate-200/60">
              ${poi.name}
            </div>
          </div>
        `,
        iconSize: [120, 24],
        iconAnchor: [12, 12],
      });

      L.marker([poi.lat, poi.lng], { icon: poiIcon, interactive: false }).addTo(layers.pois);
    });

    // 2. Geofenced Area Alerts
    areaAlerts.forEach(alert => {
      if (!alert.active) return;
      const radiusMeters = (alert.radiusKm || 1) * 1000;
      
      L.circle([alert.center.lat, alert.center.lng], {
        radius: radiusMeters,
        color: '#f59e0b',
        fillColor: '#fef3c7',
        fillOpacity: 0.28,
        weight: 2,
        dashArray: '6, 6',
      }).addTo(layers.alerts);

      const alertBadge = L.divIcon({
        className: 'custom-alert-badge',
        html: `
          <div class="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-amber-600/80 whitespace-nowrap flex items-center gap-1">
            <span>⚠️</span>
            <span>ALERT ZONE: ${alert.title}</span>
          </div>
        `,
        iconSize: [160, 24],
        iconAnchor: [80, 12],
      });
      L.marker([alert.center.lat, alert.center.lng], { icon: alertBadge, interactive: false }).addTo(layers.alerts);
    });

    // 3. User / Citizen Location Marker
    if (userLocation && userLocation.lat && userLocation.lng) {
      const userCoords: [number, number] = [userLocation.lat, userLocation.lng];
      
      // Accuracy circle
      L.circle(userCoords, {
        radius: userLocation.accuracy || 35,
        color: '#38bdf8',
        fillColor: '#e0f2fe',
        fillOpacity: 0.35,
        weight: 1.5,
      }).addTo(layers.halos);

      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div class="relative flex flex-col items-center">
            <div class="absolute -top-7 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border border-white">
              Your Location
            </div>
            <div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg ring-4 ring-blue-500/30 flex items-center justify-center animate-pulse">
              <div class="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker(userCoords, { icon: userIcon }).addTo(layers.markers);
    }

    // 4. Dynamic Incident Markers
    const targetIncidents = incidents.length > 0 
      ? incidents 
      : (selectedIncident ? [selectedIncident] : []);

    targetIncidents.forEach(inc => {
      if (!inc.location || !inc.location.lat || !inc.location.lng) return;
      const coords: [number, number] = [inc.location.lat, inc.location.lng];
      const isSelected = selectedIncident?.id === inc.id;

      // Severity Color Palette
      let mainColor = '#ef4444'; // Critical
      let haloColor = '#fee2e2';
      let pillBg = 'bg-red-100 text-red-700';

      if (inc.severity === 'High') {
        mainColor = '#f97316';
        haloColor = '#ffedd5';
        pillBg = 'bg-orange-100 text-orange-700';
      } else if (inc.severity === 'Medium' || inc.severity === 'Moderate') {
        mainColor = '#eab308';
        haloColor = '#fef9c3';
        pillBg = 'bg-yellow-100 text-yellow-800';
      } else if (inc.severity === 'Low') {
        mainColor = '#3b82f6';
        haloColor = '#dbeafe';
        pillBg = 'bg-blue-100 text-blue-700';
      }

      // Halos
      L.circle(coords, {
        radius: isSelected ? 450 : 300,
        color: mainColor,
        fillColor: haloColor,
        fillOpacity: 0.4,
        weight: 1,
        dashArray: '4, 4',
      }).addTo(layers.halos);

      L.circle(coords, {
        radius: isSelected ? 220 : 140,
        color: mainColor,
        fillColor: haloColor,
        fillOpacity: 0.6,
        weight: 0,
      }).addTo(layers.halos);

      // SVG Icon based on Emergency Type
      let typeSvg = `<path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>`;
      if (inc.type === 'Fire') {
        typeSvg = `<path d="M12 23c-4.97 0-9-4.03-9-9 0-3.56 2.06-6.63 5.08-8.08C8.5 6.84 9 7.89 9 9c0 2.21 1.79 4 4 4 .55 0 1-.45 1-1 0-2.21 1.79-4 4-4 .34 0 .67.04.98.13C19.95 9.77 21 11.77 21 14c0 4.97-4.03 9-9 9z"/>`;
      } else if (inc.type === 'Accident') {
        typeSvg = `<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>`;
      } else if (inc.type === 'Crime' || inc.type === 'Women Safety') {
        typeSvg = `<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>`;
      }

      const markerIcon = L.divIcon({
        className: 'custom-incident-marker',
        html: `
          <div class="relative flex flex-col items-center cursor-pointer">
            <!-- Floating Label Badge -->
            <div class="absolute -top-12 bg-white px-2.5 py-1 rounded-xl shadow-lg border border-slate-200 text-center whitespace-nowrap z-20 transition transform hover:scale-105">
              <div class="text-[11px] font-black text-slate-900 leading-tight">${inc.type}</div>
              <div class="flex items-center gap-1 justify-center mt-0.5">
                <span class="px-1.5 py-0.2 rounded-full text-[8px] font-extrabold uppercase ${pillBg}">${inc.severity}</span>
                <span class="text-[9px] font-mono text-slate-500">${inc.status}</span>
              </div>
            </div>

            <!-- Pulsing Circle -->
            <div class="w-10 h-10 rounded-full text-white flex items-center justify-center shadow-xl border-2 border-white ring-4 transition transform hover:scale-110" style="background-color: ${mainColor}; ring-color: ${mainColor}40">
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">${typeSvg}</svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const m = L.marker(coords, { icon: markerIcon }).addTo(layers.markers);
      m.on('click', () => {
        onSelectIncident?.(inc);
      });
    });

    // 5. Dynamic Responder Vehicle Markers
    responders.forEach(resp => {
      if (!resp.location || !resp.location.lat || !resp.location.lng) return;
      const respCoords: [number, number] = [resp.location.lat, resp.location.lng];
      const isSelected = selectedResponder?.id === resp.id;

      // Color and icon by responder type
      let respColor = '#2563eb'; // Blue
      let respSvg = `<path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>`;

      if (resp.type === 'Fire Tender') {
        respColor = '#ea580c';
        respSvg = `<path d="M12 23c-4.97 0-9-4.03-9-9 0-3.56 2.06-6.63 5.08-8.08C8.5 6.84 9 7.89 9 9c0 2.21 1.79 4 4 4 .55 0 1-.45 1-1 0-2.21 1.79-4 4-4 .34 0 .67.04.98.13C19.95 9.77 21 11.77 21 14c0 4.97-4.03 9-9 9z"/>`;
      } else if (resp.type === 'Police PCR') {
        respColor = '#4f46e5';
        respSvg = `<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>`;
      } else if (resp.type === 'Doctor Volunteer' || resp.type === 'Blood Donor') {
        respColor = '#059669';
        respSvg = `<path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>`;
      }

      const statusBadgeColor = 
        resp.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
        resp.status === 'En Route' ? 'bg-amber-100 text-amber-700 animate-pulse' :
        resp.status === 'Dispatched' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700';

      const respIcon = L.divIcon({
        className: 'custom-responder-marker',
        html: `
          <div class="relative flex flex-col items-center cursor-pointer">
            <!-- Tooltip Pill -->
            <div class="absolute -top-10 bg-white px-2 py-0.5 rounded-lg shadow-md border border-slate-200 text-left whitespace-nowrap z-20 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full ${resp.status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}"></span>
              <span class="text-[10px] font-bold text-slate-900">${resp.callSign}</span>
              <span class="text-[8px] font-bold px-1.5 rounded uppercase ${statusBadgeColor}">${resp.status}</span>
            </div>

            <!-- Vehicle Icon Circle -->
            <div class="w-8 h-8 rounded-full text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 transition transform hover:scale-110" style="background-color: ${respColor}; ring-color: ${respColor}30">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">${respSvg}</svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const rm = L.marker(respCoords, { icon: respIcon }).addTo(layers.markers);
      rm.on('click', () => {
        onSelectResponder?.(resp);
      });
    });

    // 6. Dynamic Hospital Markers
    hospitals.forEach(hosp => {
      if (!hosp.location || !hosp.location.lat || !hosp.location.lng) return;
      const hospCoords: [number, number] = [hosp.location.lat, hosp.location.lng];

      const hospIcon = L.divIcon({
        className: 'custom-hospital-marker',
        html: `
          <div class="relative flex flex-col items-center select-none pointer-events-none">
            <div class="absolute -top-7 bg-white/95 backdrop-blur px-2 py-0.5 rounded shadow border border-slate-200 text-[9px] font-bold text-slate-800 whitespace-nowrap">
              ${hosp.name} • <span class="text-emerald-600">${hosp.availableIcuBeds} ICU</span>
            </div>
            <div class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border border-white">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker(hospCoords, { icon: hospIcon }).addTo(layers.pois);
    });

    // 7. Dynamic Route Polyline
    if (drawRoute) {
      // Find active route target
      const routedIncident = selectedIncident || incidents.find(i => i.assignedResponder || (i.routePolyline && i.routePolyline.length > 0));
      
      if (routedIncident && routedIncident.location) {
        let routeCoords: [number, number][] = [];

        if (routedIncident.routePolyline && routedIncident.routePolyline.length > 1) {
          routeCoords = routedIncident.routePolyline;
        } else if (routedIncident.assignedResponder && routedIncident.assignedResponder.location) {
          const respPos: [number, number] = [routedIncident.assignedResponder.location.lat, routedIncident.assignedResponder.location.lng];
          const incPos: [number, number] = [routedIncident.location.lat, routedIncident.location.lng];
          
          // Generate 4 intermediate road points
          routeCoords = [
            respPos,
            [respPos[0] + (incPos[0] - respPos[0]) * 0.33, respPos[1] + (incPos[1] - respPos[1]) * 0.25],
            [respPos[0] + (incPos[0] - respPos[0]) * 0.66, respPos[1] + (incPos[1] - respPos[1]) * 0.75],
            incPos
          ];
        }

        if (routeCoords.length >= 2) {
          // Glow layer
          L.polyline(routeCoords, {
            color: '#3b82f6',
            weight: 7,
            opacity: 0.35,
          }).addTo(layers.routes);

          // Vivid dashed driving line
          L.polyline(routeCoords, {
            color: '#1d4ed8',
            weight: 3.5,
            opacity: 0.95,
            dashArray: '6, 6',
          }).addTo(layers.routes);

          // Add floating ETA pill at the route midpoint
          const midIdx = Math.floor(routeCoords.length / 2);
          const midPoint = routeCoords[midIdx];
          const etaSecs = routedIncident.etaSeconds || 120;
          const etaText = `${Math.ceil(etaSecs / 60)} min`;

          const etaPill = L.divIcon({
            className: 'custom-eta-pill',
            html: `
              <div class="bg-blue-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-white whitespace-nowrap flex items-center gap-1">
                <span>⚡ ETA</span>
                <span>${etaText}</span>
              </div>
            `,
            iconSize: [60, 20],
            iconAnchor: [30, 10],
          });
          L.marker(midPoint, { icon: etaPill, interactive: false }).addTo(layers.routes);
        }
      }
    }

  }, [incidents, responders, hospitals, areaAlerts, selectedIncident, selectedResponder, userLocation, drawRoute]);

  // Zoom controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleLocate = () => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      mapInstanceRef.current?.setView([userLocation.lat, userLocation.lng], 15, { animate: true });
    } else if (selectedIncident && selectedIncident.location) {
      mapInstanceRef.current?.setView([selectedIncident.location.lat, selectedIncident.location.lng], 15, { animate: true });
    } else {
      mapInstanceRef.current?.setView(center, 15, { animate: true });
    }
  };

  return (
    <div className={`relative isolate z-0 ${className} overflow-hidden rounded-2xl bg-slate-50 shadow-sm border border-slate-200`}>
      <div ref={containerRef} className="w-full h-full min-h-[460px]" />

      {/* Top Left: Live Map Indicator Badge */}
      <div className="absolute top-4 left-4 z-[400] flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm border border-slate-200">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Live Hyderabad Grid</span>
      </div>

      {/* Bottom Right: Zoom & Navigation Buttons */}
      <div className="absolute bottom-6 right-4 z-[400] flex flex-col gap-1 shadow-sm">
        <button 
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-t-lg bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 font-bold transition active:bg-slate-100"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-b-lg bg-white hover:bg-slate-50 border-x border-b border-slate-200 flex items-center justify-center text-slate-700 font-bold transition active:bg-slate-100"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button 
          onClick={handleLocate}
          className="w-8 h-8 mt-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 font-bold transition active:bg-slate-100"
          title="Center on Target Location"
        >
          <Navigation className="w-3.5 h-3.5 text-slate-700 -rotate-45" />
        </button>
      </div>

      {/* Bottom Center: Floating Map Legend Pill */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-3.5 rounded-full bg-white/95 backdrop-blur px-4 py-1.5 text-[11px] font-semibold text-slate-600 shadow-md border border-slate-200">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
          <span>Incident</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
          <span>Responder</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span>Hospital</span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-600 font-mono">
          <span>--</span>
          <span className="text-slate-600 font-sans">Live Route</span>
        </div>
      </div>
    </div>
  );
};

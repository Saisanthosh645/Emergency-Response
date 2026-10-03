import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Incident, Responder, Hospital, AreaAlert } from '../../types';
import { Layers, Plus, Minus, Navigation } from 'lucide-react';

interface EmergencyMapProps {
  incidents?: Incident[];
  responders?: Responder[];
  hospitals?: Hospital[];
  areaAlerts?: AreaAlert[];
  selectedIncident?: Incident | null;
  selectedResponder?: Responder | null;
  onSelectIncident?: (incident: Incident) => void;
  onSelectResponder?: (responder: Responder) => void;
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
  center = [17.4215, 78.4310], // Centered around Banjara Hills / Road No. 12
  zoom = 14,
  showHeatmap = false,
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
  } | null>(null);

  // Initialize Map with CartoDB Voyager (Modern clean light map)
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: false, // We render custom zoom buttons matching the design
      dragging: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      attributionControl: false,
    });

    // CartoDB Voyager Tile Layer (Clean light theme matching screenshot)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    const halosGroup = L.layerGroup().addTo(map);
    const routesGroup = L.layerGroup().addTo(map);
    const poisGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    layersRef.current = {
      markers: markersGroup,
      routes: routesGroup,
      pois: poisGroup,
      halos: halosGroup,
    };

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center when changed
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  }, [center[0], center[1], zoom]);

  // Render Markers and Features matching screenshot
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layers = layersRef.current;
    if (!map || !layers) return;

    layers.markers.clearLayers();
    layers.routes.clearLayers();
    layers.pois.clearLayers();
    layers.halos.clearLayers();

    // 1. POI Landmarks (Apollo, Care, Banjara Police, GVK One, City Central)
    const landmarks = [
      { name: 'Apollo Hospitals\nJubilee Hills', lat: 17.4319, lng: 78.4073, type: 'hospital' },
      { name: 'Care Hospital', lat: 17.4156, lng: 78.4350, type: 'hospital' },
      { name: 'Banjara Hills\nPolice Station', lat: 17.4180, lng: 78.4410, type: 'police' },
      { name: 'GVK One Mall', lat: 17.4200, lng: 78.4480, type: 'mall' },
      { name: 'City Central Mall', lat: 17.4270, lng: 78.4550, type: 'mall' },
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
      }

      const poiIcon = L.divIcon({
        className: 'custom-poi-marker',
        html: `
          <div class="flex items-center gap-1.5 pointer-events-none select-none">
            <div class="w-5 h-5 rounded-full flex items-center justify-center text-white shadow-sm" style="background-color: ${iconColor}">
              <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24">${iconSvg}</svg>
            </div>
            <div class="text-[11px] font-bold text-slate-700 leading-tight whitespace-pre drop-shadow-sm font-sans">
              ${poi.name}
            </div>
          </div>
        `,
        iconSize: [120, 24],
        iconAnchor: [12, 12],
      });

      L.marker([poi.lat, poi.lng], { icon: poiIcon, interactive: false }).addTo(layers.pois);
    });

    // 2. Incident Marker (Banjara Hills Medical Emergency)
    const incidentCoords: [number, number] = [17.4245, 78.4230];

    // Radial translucent halo ring around incident
    L.circle(incidentCoords, {
      radius: 400,
      color: '#ef4444',
      fillColor: '#fee2e2',
      fillOpacity: 0.45,
      weight: 1,
      dashArray: '4, 4'
    }).addTo(layers.halos);

    L.circle(incidentCoords, {
      radius: 200,
      color: '#f87171',
      fillColor: '#fecaca',
      fillOpacity: 0.6,
      weight: 0,
    }).addTo(layers.halos);

    const incidentMarkerIcon = L.divIcon({
      className: 'custom-incident-icon',
      html: `
        <div class="relative flex flex-col items-center">
          <!-- Floating Badge -->
          <div class="absolute -top-12 bg-white px-2.5 py-1 rounded-lg shadow-md border border-slate-200 text-center whitespace-nowrap z-20">
            <div class="text-[11px] font-bold text-slate-900 leading-tight">Medical Emergency</div>
            <span class="inline-block mt-0.5 px-2 py-0.2 rounded-full text-[9px] font-extrabold uppercase bg-red-100 text-red-600">Critical</span>
          </div>

          <!-- Red Circle with White Cross -->
          <div class="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-red-500/20">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    L.marker(incidentCoords, { icon: incidentMarkerIcon }).addTo(layers.markers);

    // 3. Citizen "Your Location" Marker (Blue with radar circles)
    const citizenCoords: [number, number] = [17.4100, 78.4110];

    L.circle(citizenCoords, {
      radius: 350,
      color: '#38bdf8',
      fillColor: '#e0f2fe',
      fillOpacity: 0.4,
      weight: 1,
    }).addTo(layers.halos);

    const citizenIcon = L.divIcon({
      className: 'custom-citizen-icon',
      html: `
        <div class="w-6 h-6 rounded-full bg-blue-600 border-3 border-white shadow-md ring-4 ring-blue-500/30"></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    L.marker(citizenCoords, { icon: citizenIcon }).addTo(layers.markers);

    // 4. Dispatched Responder Ambulance Marker & Route Polyline
    const responderCoords: [number, number] = [17.4150, 78.4310];

    // Smooth route line
    const routePoints: [number, number][] = [
      citizenCoords,
      [17.4125, 78.4200],
      [17.4150, 78.4310], // Responder position
      [17.4200, 78.4280],
      incidentCoords
    ];

    L.polyline(routePoints, {
      color: '#2563eb', // Vivid Blue
      weight: 3.5,
      opacity: 0.9,
      dashArray: '6, 6',
    }).addTo(layers.routes);

    const responderIcon = L.divIcon({
      className: 'custom-responder-icon',
      html: `
        <div class="relative flex flex-col items-center">
          <!-- Floating Distance/ETA Tooltip -->
          <div class="absolute -top-11 -right-8 bg-white px-2 py-1 rounded-lg shadow-md border border-slate-200 text-left whitespace-nowrap z-20 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
            <div>
              <div class="text-[10px] font-bold text-slate-800 leading-tight">1.8 km</div>
              <div class="text-[9px] text-slate-500 font-mono">ETA 6 min</div>
            </div>
          </div>

          <!-- Blue Circle with White Ambulance Icon -->
          <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-blue-500/25">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker(responderCoords, { icon: responderIcon }).addTo(layers.markers);

  }, [incidents, responders, hospitals]);

  // Zoom controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleLocate = () => {
    mapInstanceRef.current?.setView([17.4100, 78.4110], 15, { animate: true });
  };

  return (
    <div className={`relative ${className} overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100`}>
      <div ref={containerRef} className="w-full h-full min-h-[460px]" />

      {/* Top Left: Live Map Indicator Badge */}
      <div className="absolute top-4 left-4 z-[400] flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm border border-slate-200">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Live Map</span>
      </div>

      {/* Top Right: Layer Switcher Button */}
      <button 
        className="absolute top-4 right-4 z-[400] w-8 h-8 rounded-lg bg-white/95 backdrop-blur shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition"
        title="Toggle Layers"
      >
        <Layers className="w-4 h-4" />
      </button>

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
          title="Center on My Location"
        >
          <Navigation className="w-3.5 h-3.5 text-slate-700 -rotate-45" />
        </button>
      </div>

      {/* Bottom Center: Floating Map Legend Pill */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-4 rounded-full bg-white/95 backdrop-blur px-4 py-1.5 text-[11px] font-semibold text-slate-600 shadow-md border border-slate-200">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
          <span>Incident</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
          <span>Responder</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span>
          <span>Your Location</span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-600 font-mono">
          <span>--</span>
          <span className="text-slate-600 font-sans">Route</span>
        </div>
      </div>
    </div>
  );
};

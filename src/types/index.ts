export type EmergencyType = 
  | 'Medical'
  | 'Fire'
  | 'Accident'
  | 'Crime'
  | 'Women Safety'
  | 'Disaster'
  | 'Animal Rescue';

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type IncidentStatus = 
  | 'Reported'
  | 'Verified'
  | 'Assigned'
  | 'En Route'
  | 'Arrived'
  | 'Hospitalizing'
  | 'Resolved'
  | 'Cancelled';

export type ResponderType = 
  | 'ALS Ambulance'
  | 'BLS Ambulance'
  | 'Fire Tender'
  | 'Police PCR'
  | 'Blood Donor'
  | 'Doctor Volunteer'
  | 'Disaster NGO';

export type ResponderStatus = 'Available' | 'Dispatched' | 'En Route' | 'On Scene' | 'Offline';

export interface LocationPoint {
  lat: number;
  lng: number;
  address: string;
  area: string;
  accuracyMeters?: number;
}

export interface AITriageResult {
  emergencyType: EmergencyType;
  severity: SeverityLevel;
  confidence: number;
  recommendedResponder: string;
  firstAidInstructions: string[];
  detectedLanguage: string;
  patientConditionSummary: string;
}

export interface TimelineEntry {
  status: IncidentStatus;
  timestamp: number;
  note: string;
  actor: string;
}

export interface ChatMessage {
  id: string;
  sender: 'citizen' | 'responder' | 'dispatcher';
  senderName: string;
  text: string;
  timestamp: number;
}

export interface Responder {
  id: string;
  name: string;
  callSign: string;
  type: ResponderType;
  status: ResponderStatus;
  location: {
    lat: number;
    lng: number;
    area: string;
  };
  phone: string;
  rating: number;
  casesHandled: number;
  avgResponseMin: number;
  equipment: string[];
  skills: string[];
  bloodGroup?: string;
  cprCertified?: boolean;
  currentIncidentId?: string;
  vehicleNo: string;
  organization: string;
}

export interface Hospital {
  id: string;
  name: string;
  area: string;
  location: {
    lat: number;
    lng: number;
  };
  totalBeds: number;
  availableIcuBeds: number;
  availableTraumaBeds: number;
  availableVentilators: number;
  oxygenReserveDays: number;
  bloodUnitsAvailable: Record<string, number>;
  emergencyPhone: string;
  traumaLevel: 'Level 1 Trauma' | 'Level 2 Trauma' | 'General Tertiary';
  specialistOnDuty: string;
}

export interface Incident {
  id: string;
  type: EmergencyType;
  severity: SeverityLevel;
  status: IncidentStatus;
  citizenName: string;
  citizenPhone: string;
  description: string;
  location: LocationPoint;
  timestamp: number;
  assignedResponderId?: string;
  assignedResponder?: Responder;
  assignedHospitalId?: string;
  assignedHospital?: Hospital;
  etaSeconds?: number;
  routePolyline?: [number, number][];
  aiTriage?: AITriageResult;
  goodSamaritansAlerted?: number;
  timeline: TimelineEntry[];
  chatMessages: ChatMessage[];
  isDuplicateOf?: string;
  isSimulated?: boolean;
  escalationTier: number; // 0 = standard, 1 = radius expanded (60s+), 2 = supervisor alerted
  offlineQueued?: boolean;
}

export interface AreaAlert {
  id: string;
  title: string;
  description: string;
  severity: 'Emergency' | 'High' | 'Advisory';
  center: { lat: number; lng: number; area: string };
  radiusKm: number;
  type: 'Flood' | 'Fire' | 'Road Closure' | 'Traffic' | 'Toxic Hazard';
  active: boolean;
  issuedAt: number;
  expiresAt: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  notifyOnSOS: boolean;
}

export interface AuditLogItem {
  id: string;
  timestamp: number;
  incidentId?: string;
  action: string;
  actor: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

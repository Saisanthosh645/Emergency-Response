export type EmergencyType = 
  | 'Medical'
  | 'Fire'
  | 'Accident'
  | 'Crime'
  | 'Women Safety'
  | 'Disaster'
  | 'Animal Rescue';

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Moderate' | 'Low';

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
  address?: string;
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
  rating?: number;
  proximityKm?: number;
  waitTimeMin?: number;
  categoryTag?: string;
  facilityType?: 'all' | 'trauma' | 'clinic';
}

export interface HospitalBedBooking {
  id: string;
  hospitalId: string;
  hospitalName: string;
  patientName: string;
  patientPhone: string;
  patientAge: string;
  patientGender: string;
  condition: string;
  bedType: 'icu_ventilator' | 'cardiac_cicu' | 'hdu' | 'trauma_bay';
  transportMode: 'ambulance' | 'private_vehicle' | 'need_dispatch';
  notes?: string;
  timestamp: number;
  token: string;
  status: 'CONFIRMED' | 'IN_TRANSIT' | 'ARRIVED' | 'CANCELLED';
  erBayAssigned: string;
  leadPhysician: string;
}

export interface BloodBank {
  id: string;
  name: string;
  area: string;
  address: string;
  distanceKm: number;
  phone: string;
  inventory: Record<string, number>;
  verified: boolean;
  coldChainActive: boolean;
}

export interface BloodReservation {
  id: string;
  bloodBankId: string;
  bloodBankName: string;
  bloodGroup: string;
  unitsCount: number;
  patientName: string;
  patientPhone: string;
  patientHospital: string;
  urgencyLevel: 'Emergency STAT' | 'Urgent (Within 2 Hours)' | 'Scheduled Surgery';
  coldChainCourierAssigned: string;
  token: string;
  temperatureCelsius: number;
  timestamp: number;
  status: 'CONFIRMED' | 'DISPATCHED_IN_TRANSIT' | 'DELIVERED';
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
  createdAt?: number;
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
  escalationLevel?: number;
  offlineQueued?: boolean;
  coordinatingResponders?: { responderId: string; responder: Responder; role: string }[];
  greenCorridorActive?: boolean;
  sha256Hash?: string;
  milestoneMetrics?: IncidentMilestoneMetrics;
}

export interface NavigationTurnStep {
  instruction: string;
  distanceMeters: number;
  roadName: string;
  icon: 'straight' | 'left' | 'right' | 'u-turn' | 'destination';
}

export interface SystemNotification {
  id: string;
  timestamp: number;
  title: string;
  message: string;
  type?: 'escalation' | 'dispatch' | 'arrival' | 'alert' | 'comms' | 'system' | string;
  severity?: 'critical' | 'high' | 'info' | 'low';
  incidentId?: string;
  read: boolean;
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

export interface DataAccessLogEntry {
  id: string;
  timestamp: number;
  actor: string;
  action: string;
  target: string;
  purpose: string;
  ipMasked: string;
}

export interface PrivacySettings {
  anonymizePhone: boolean;
  maskCitizenName: boolean;
  fuzzyResolvedLocation: boolean;
  ephemeralGpsActive: boolean;
  autoPurgeDays: number;
  encryptionStandard: 'AES-256-GCM (Hardware Backed)' | 'ChaCha20-Poly1305';
  dpdpConsentLogged: boolean;
}

export interface IncidentMilestoneMetrics {
  callInitiatedTime: number;
  triageDurationSeconds: number;
  dispatchLatencySeconds: number;
  wheelRollDurationSeconds: number;
  onSceneArrivalSeconds: number;
  handoverDurationSeconds?: number;
  totalResolutionSeconds?: number;
  slaTargetSeconds: number;
  isSlaMet: boolean;
  sha256Checksum: string;
  slaMet?: boolean;
  cryptographicChecksum?: string;
  totalResponseSeconds?: number;
  t0_callReceived?: number;
  t1_triageVerified?: number;
  t2_unitDispatched?: number;
  t3_wheelsRolling?: number;
  t4_onSceneArrival?: number;
  t5_hospitalHandover?: number;
  t6_incidentResolved?: number;
}

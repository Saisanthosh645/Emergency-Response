export type Language = 'en' | 'hi' | 'te' | 'mr';

export interface TranslationDictionary {
  // App & Brand
  appTitle: string;
  tagline: string;
  fromTo: string;
  online: string;
  offline: string;
  liveBadge: string;
  liveStockBadge: string;

  // General & Common
  exitToDashboard: string;
  close: string;
  back: string;
  all: string;
  clear: string;
  justNow: string;
  minsAgo: string;
  unread: string;
  activeNotifications: string;
  searchPlaceholder: string;
  emergencyFacilitiesHeader: string;
  switchPerspective: string;
  citizenDashboard: string;
  responderTerminal: string;
  adminCommandCenter: string;
  guidedDemo: string;
  privacyTrustNav: string;
  trackLive: string;
  total: string;
  statusLabel: string;
  filterByIdOrAddress: string;
  emergencyWord: string;
  assignedUnit: string;
  smartDispatching: string;

  // SOS
  sosButton: string;
  sosHolding: string;
  sosTriggered: string;
  silentSos: string;
  silentSosTip: string;
  gpsLocked: string;
  manualPin: string;
  emergencyType: string;
  types: {
    Medical: string;
    Fire: string;
    Accident: string;
    Crime: string;
    'Women Safety': string;
    Disaster: string;
    'Animal Rescue': string;
  };
  voiceNote: string;
  voiceListening: string;
  typeDescription: string;
  submitEmergency: string;
  submitting: string;
  eta: string;
  mins: string;
  secs: string;
  statusSteps: {
    Reported: string;
    Verified: string;
    Assigned: string;
    'En Route': string;
    Arrived: string;
    Hospitalizing: string;
    Resolved: string;
  };
  firstAidHeading: string;
  callResponder: string;
  chatWithResponder: string;
  shareLiveTracking: string;
  emergencyContacts: string;
  contactsAlerted: string;
  quickDial: string;
  offlineBanner: string;
  goodSamaritanAlerted: string;
  privacyNotice: string;
  roleCitizen: string;
  roleResponder: string;
  roleAdmin: string;
  roleDemo: string;
  privacyTrust: string;

  // Dashboard Sidebar Navigation
  nav: {
    home: string;
    liveMap: string;
    incidents: string;
    hospitalBeds: string;
    bloodMatcher: string;
    history: string;
    emergencyContacts: string;
    settings: string;
  };

  // Top Nav Tabs
  tabs: {
    emergencySOS: string;
    hospitalsER: string;
    bloodMatcher: string;
    ambulanceFleet: string;
    careRecords: string;
  };

  // Stay Safe Card
  staySafe: string;
  staySafeDesc: string;
  learnMore: string;

  // Home Tab - SOS Console
  emergencyConsole: string;
  emergencyHeadline: string;
  pressHoldSOS: string;
  sosDescription: string;
  activeMesh: string;
  mesh: string;
  holdForSeconds: string;
  secondsLeft: string;
  orHold: string;
  forSeconds: string;
  locationSharedNote: string;
  needTriageReport: string;
  formReporting: string;

  // Home - Emergency Contacts
  viewAll: string;
  police: string;
  ambulance: string;
  fire: string;

  // Home - Map Section
  liveGrid: string;

  // Home - Response Progress
  responseProgress: string;
  viewDetails: string;

  // Home - Nearby Emergency Services
  nearbyServices: string;
  cityHospital: string;
  policeStation: string;
  fireStation: string;
  openAllDay: string;
  quickHelp: string;
  quickHelpDesc: string;
  quickHelpLearnMore: string;

  // Home - Incident Card (Right)
  inProgress: string;
  medicalEmergency: string;
  banjaraHills: string;
  critical: string;
  etaLabel: string;
  distanceLabel: string;
  enRoute: string;
  aiAssistedTriage: string;
  riskIndicators: string;
  possibleLossOfConsciousness: string;
  roadsideLocation: string;
  trafficExposure: string;
  recommendedResponse: string;
  advancedMedical: string;
  confidence: string;
  incidentTimeline: string;
  emergencyReported: string;
  locationConfirmed: string;
  aiTriageCompleted: string;
  responderAssigned: string;
  arrived: string;
  arrivedAtLocation: string;

  // Incidents Tab
  incidentsTitle: string;
  incidentsSubtitle: string;
  searchIncidents: string;
  filterAll: string;
  filterActive: string;
  filterResolved: string;
  filterCritical: string;
  filterHigh: string;
  filterMedium: string;
  noIncidentsFound: string;
  unassigned: string;
  assignResponder: string;
  escalate: string;
  viewIncident: string;

  // Map Tab
  activeResponseSector: string;
  unitsOnline: string;
  allUnits: string;
  alsAmbulance: string;
  fireTenders: string;
  policePatrols: string;
  hospitals: string;
  triggerSOS: string;
  activeDispatches: string;
  liveTelemetry: string;

  // History Tab
  historyTitle: string;
  historySubtitle: string;
  exportCSV: string;
  searchHistory: string;
  totalIncidents: string;
  avgResponseTime: string;
  slaCompliance: string;
  hospitalHandovers: string;
  incidentId: string;
  type: string;
  severity: string;
  status: string;
  reportedTime: string;
  responseTime: string;
  responder: string;
  viewDossier: string;
  exportJson: string;
  form112Standard: string;
  exportRegistryCsv: string;
  resolvedCases: string;
  resolutionRate: string;
  avgResponseLatency: string;
  nationalBenchmark: string;
  goldenHourSLA: string;
  casesWithinTarget: string;
  hospitalErHandovers: string;
  icuCathLabRes: string;
  milestoneDist: string;
  totalAnalyzed: string;
  optimalImmediate: string;
  withinTargetSla: string;
  heavyCongestion: string;
  casesWord: string;
  categoryBreakdown: string;
  eocMetro: string;
  medicalCardiac: string;
  medicalCardiacSub: string;
  fireHazmat: string;
  fireHazmatSub: string;
  highwayAccidents: string;
  highwayAccidentsSub: string;
  womenSafetySos: string;
  womenSafetySosSub: string;

  // Hospital Beds Tab
  hospitalBedsTitle: string;
  hospitalBedsSubtitle: string;
  heuristicsFilter: string;
  searchHospitals: string;
  allCategories: string;
  traumaCenter: string;
  clinic: string;
  bedsAvailable: string;
  bookBed: string;
  bookPriorityBed: string;
  callDirect: string;
  icuBeds: string;
  cardiacBeds: string;
  hduBeds: string;
  traumaBay: string;
  totalBeds: string;
  availableBeds: string;
  allFacilities: string;
  traumaHospitals: string;
  urgentClinics: string;
  proximityLabel: string;
  icuBedsLabel: string;
  erWaitTimeLabel: string;
  availableWord: string;
  activeBedReservations: string;
  activeCount: string;
  patientLabel: string;
  bypassTokenLabel: string;
  bayLabel: string;
  viewPassBtn: string;
  mapRouteBtn: string;

  // Blood Matcher Tab
  bloodMatcherTitle: string;
  bloodMatcherSubtitle: string;
  selectBloodGroup: string;
  searchBloodBanks: string;
  unitsAvailable: string;
  reserveBlood: string;
  coldChain: string;
  unitsCount: string;
  temperature: string;
  coldChainSecuredBadge: string;
  filterByBloodGroup: string;
  liveBiomarkerTelemetry: string;
  availableReserveUnits: string;
  unitsCriticalBadge: string;
  reserveColdChainBtn: string;
  activeBloodDispatches: string;
  transitTemp: string;
  lockStatus: string;
  secured: string;
  etaMin: string;

  // Contacts Tab
  contactsTitle: string;
  contactsSubtitle: string;
  addContact: string;
  nationalHelplines: string;
  personalContacts: string;
  deleteContact: string;
  name: string;
  phone: string;
  relation: string;
  addNewContact: string;
  cancel: string;
  save: string;
  emergencyDirTitle: string;
  emergencyDirSubtitle: string;
  addEmergencyContactBtn: string;
  govtHelplinesTitle: string;
  dialBtn: string;
  unifiedEmergencyName: string;
  unifiedEmergencyDesc: string;
  medicalAmbulanceName: string;
  medicalAmbulanceDesc: string;
  policeControlName: string;
  policeControlDesc: string;
  fireRescueName: string;
  fireRescueDesc: string;
  womenSafetyName: string;
  womenSafetyDesc: string;
  childlineName: string;
  childlineDesc: string;
  disasterMgmtName: string;
  disasterMgmtDesc: string;
  cyberCrimeName: string;
  cyberCrimeDesc: string;
  smsGatewayTitle: string;
  smsGatewayDesc: string;
  simulateSmsBtn: string;
  smsPayloadTitle: string;
  myContactsTitle: string;

  // Settings Tab
  settingsTitle: string;
  settingsSubtitle: string;
  interfaceLanguage: string;
  languageDesc: string;
  audioAlerts: string;
  audioAlertsDesc: string;
  testSiren: string;
  stopSiren: string;
  lowConnectivity: string;
  lowConnectivityDesc: string;
  proximityAlerts: string;
  proximityAlertsDesc: string;
  medicalId: string;
  medicalIdDesc: string;
  bloodGroup: string;
  allergies: string;
  emergencyContactName: string;
  donorConsent: string;
  saveSettings: string;
  settingsSaved: string;
  platformSettingsTitle: string;
  platformSettingsSubtitle: string;
  settingsSavedMessage: string;
  offlineModeTitle: string;
  offlineModeDesc: string;
  offlineActiveBadge: string;
  onlineModeBadge: string;
  geofenceTitle: string;
  geofenceDesc: string;
  medicalProfileTitle: string;
  encryptedLocally: string;
  universalDonor: string;
  knownAllergies: string;
  saveMedicalProfileBtn: string;

  // Modals
  emergencyDispatchTitle: string;
  bookBedModalTitle: string;
  contactNumber: string;
  reasonAdmission: string;
  bedCategory: string;
  confirmBedBooking: string;
  priorityPassTitle: string;
  directEmergencyDesk: string;
  reserveBloodModalTitle: string;
  unitsNeeded: string;
  urgencyLevel: string;
  immediateSurgery: string;
  scheduledTrauma: string;
  destinationHospital: string;
  confirmBloodReservation: string;
  safetyGuideHeading: string;
  incidentDossierTitle: string;
  sha256Digest: string;
  dpdpCertified: string;
  incidentDispatchDetails: string;

  // Extra tab titles
  icuTriageTitle: string;
  icuTriageSubtitle: string;
  nationalBloodTitle: string;
  nationalBloodSubtitle: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    // App & Brand
    appTitle: 'Lifeline India',
    tagline: 'Hyperlocal Emergency Response Platform',
    fromTo: 'From emergency to responder in under 60 seconds',
    online: 'Online',
    offline: 'Offline',
    liveBadge: 'LIVE',
    liveStockBadge: 'LIVE STOCK',

    // General & Common
    exitToDashboard: '← EXIT TO DASHBOARD',
    close: 'Close',
    back: 'Back',
    all: 'All',
    clear: 'Clear',
    justNow: 'Just now',
    minsAgo: 'm ago',
    unread: 'unread',
    activeNotifications: 'Active Notifications',
    searchPlaceholder: 'Search location, hospital, incident or phone...',
    emergencyFacilitiesHeader: 'Emergency Services & Facilities',
    switchPerspective: 'Switch Perspective',
    citizenDashboard: 'Citizen Dashboard',
    responderTerminal: 'Responder Terminal',
    adminCommandCenter: 'Admin Command Center',
    guidedDemo: '90-Sec Guided Demo',
    privacyTrustNav: 'Privacy & Trust',
    trackLive: 'Track Live',
    total: 'Total',
    statusLabel: 'Status:',
    filterByIdOrAddress: 'Filter by ID or address...',
    emergencyWord: 'Emergency',
    assignedUnit: 'Assigned Unit',
    smartDispatching: 'Smart Dispatching...',

    // SOS
    sosButton: 'HOLD 2 SEC FOR SOS',
    sosHolding: 'HOLDING... RELEASE TO CANCEL',
    sosTriggered: 'SOS ACTIVATED - DISPATCHING NOW',
    silentSos: 'Silent SOS (Triple Tap)',
    silentSosTip: 'Discreet beacon for women safety or threat',
    gpsLocked: 'GPS Locked (High Accuracy)',
    manualPin: 'Adjust Pin',
    emergencyType: 'Select Emergency Category',
    types: {
      Medical: 'Medical / Cardiac',
      Fire: 'Fire / Explosion',
      Accident: 'Road Accident',
      Crime: 'Crime / Threat',
      'Women Safety': 'Women Safety / SHE',
      Disaster: 'Disaster / Flood',
      'Animal Rescue': 'Animal Rescue'
    },
    voiceNote: 'Speak Emergency Note',
    voiceListening: 'Listening... (Speak in English, Hindi, or Telugu)',
    typeDescription: 'Or describe emergency in detail...',
    submitEmergency: 'Send Emergency Alert to 112 / Responders',
    submitting: 'Triage & Dispatching...',
    eta: 'Responder ETA',
    mins: 'min',
    secs: 'sec',
    statusSteps: {
      Reported: 'SOS Reported',
      Verified: 'AI Verified',
      Assigned: 'Unit Assigned',
      'En Route': 'En Route',
      Arrived: 'On Scene',
      Hospitalizing: 'Hospital Handover',
      Resolved: 'Resolved'
    },
    firstAidHeading: 'Immediate First-Aid Instructions',
    callResponder: 'Call Responder',
    chatWithResponder: 'Live Chat',
    shareLiveTracking: 'Share Live GPS (WhatsApp)',
    emergencyContacts: 'Emergency Contacts',
    contactsAlerted: '3 Family contacts notified with your live coordinates',
    quickDial: 'National Quick Helpline Tiles',
    offlineBanner: 'Offline Mode: SOS queued locally. Simulating SMS relay to 112 gateway.',
    goodSamaritanAlerted: 'Good Samaritans Nearby Alerted',
    privacyNotice: 'Location shared strictly during active incident. Ephemeral data purged post-resolution.',
    roleCitizen: 'Citizen App',
    roleResponder: 'Responder Terminal',
    roleAdmin: 'Command Center',
    roleDemo: '90-Sec Live Demo',
    privacyTrust: 'Privacy & Security',

    // Dashboard Sidebar Navigation
    nav: {
      home: 'Home',
      liveMap: 'Live Map',
      incidents: 'Incidents',
      hospitalBeds: 'Hospital Beds',
      bloodMatcher: 'Blood Matcher',
      history: 'History',
      emergencyContacts: 'Emergency Contacts',
      settings: 'Settings',
    },

    // Top Nav Tabs
    tabs: {
      emergencySOS: 'Emergency SOS',
      hospitalsER: 'Hospitals & ER',
      bloodMatcher: 'Blood Matcher',
      ambulanceFleet: 'Ambulance Fleet',
      careRecords: 'Care Records',
    },

    // Stay Safe Card
    staySafe: 'Stay Safe',
    staySafeDesc: 'Be prepared. Know your nearby emergency services.',
    learnMore: 'Learn more',

    // Home Tab - SOS Console
    emergencyConsole: 'EMERGENCY CONSOLE',
    emergencyHeadline: 'EMERGENCY?',
    pressHoldSOS: 'PRESS & HOLD SOS',
    sosDescription: 'Instantly alert nearby hospitals, ambulance fleets, and emergency responders. Your location will be shared with emergency services immediately.',
    activeMesh: 'ACTIVE',
    mesh: 'MESH',
    holdForSeconds: 'HOLD FOR 5 SECONDS',
    secondsLeft: 's LEFT',
    orHold: 'or hold',
    forSeconds: 'for 5s',
    locationSharedNote: 'Your location will be shared with emergency services immediately.',
    needTriageReport: 'Need detailed triage report?',
    formReporting: 'Form Reporting',

    // Home - Emergency Contacts
    viewAll: 'View all',
    police: 'Police',
    ambulance: 'Ambulance',
    fire: 'Fire',

    // Home - Map Section
    liveGrid: 'Live Hyderabad Grid',

    // Home - Response Progress
    responseProgress: 'Response Progress',
    viewDetails: 'View details',

    // Home - Nearby Emergency Services
    nearbyServices: 'Nearby Emergency Services',
    cityHospital: 'City Hospital',
    policeStation: 'Police Station',
    fireStation: 'Fire Station',
    openAllDay: 'Open • 24/7',
    quickHelp: 'Quick Help',
    quickHelpDesc: "In an emergency? Press & hold the SOS button or call 108.",
    quickHelpLearnMore: 'Learn More →',

    // Home - Incident Card (Right)
    inProgress: 'In Progress',
    medicalEmergency: 'Medical Emergency',
    banjaraHills: 'Banjara Hills, Hyderabad',
    critical: 'Critical',
    etaLabel: 'ETA',
    distanceLabel: 'Distance',
    enRoute: 'En Route',
    aiAssistedTriage: 'AI-Assisted Triage',
    riskIndicators: 'Risk indicators',
    possibleLossOfConsciousness: 'Possible loss of consciousness',
    roadsideLocation: 'Roadside location',
    trafficExposure: 'Traffic exposure',
    recommendedResponse: 'Recommended response',
    advancedMedical: 'Advanced medical response',
    confidence: 'Confidence',
    incidentTimeline: 'Incident Timeline',
    emergencyReported: 'Emergency reported',
    locationConfirmed: 'Location confirmed',
    aiTriageCompleted: 'AI triage completed',
    responderAssigned: 'Responder assigned',
    arrived: 'Arrived',
    arrivedAtLocation: 'Arrived at location',

    // Incidents Tab
    incidentsTitle: 'Active & Recent Incidents',
    incidentsSubtitle: 'Real-time incident feed, severity classification, and dispatch tracking.',
    searchIncidents: 'Search incidents, ID, location...',
    filterAll: 'All',
    filterActive: 'Active',
    filterResolved: 'Resolved',
    filterCritical: 'Critical',
    filterHigh: 'High',
    filterMedium: 'Medium',
    noIncidentsFound: 'No incidents match your filters.',
    unassigned: 'Unassigned',
    assignResponder: 'Assign Responder',
    escalate: 'Escalate',
    viewIncident: 'View Incident',

    // Map Tab
    activeResponseSector: 'Active Response Sector: Greater Hyderabad Metro',
    unitsOnline: 'Units Online',
    allUnits: 'All Units',
    alsAmbulance: '108 ALS',
    fireTenders: 'Fire Tenders',
    policePatrols: 'Police Patrols',
    hospitals: 'Hospitals',
    triggerSOS: 'Trigger SOS',
    activeDispatches: 'Active Dispatches',
    liveTelemetry: 'Live Telemetry',

    // History Tab
    historyTitle: 'Emergency Response History & Analytics',
    historySubtitle: 'Comprehensive audit trail with cryptographic integrity and DPDP compliance.',
    exportCSV: 'Export Form 112 CSV',
    searchHistory: 'Search by ID, type, location, responder...',
    totalIncidents: 'Total Incidents',
    avgResponseTime: 'Avg Response Time',
    slaCompliance: 'SLA Compliance',
    hospitalHandovers: 'Hospital Handovers',
    incidentId: 'Incident ID',
    type: 'Type',
    severity: 'Severity',
    status: 'Status',
    reportedTime: 'Reported',
    responseTime: 'Response Time',
    responder: 'Responder',
    viewDossier: 'View Dossier',
    exportJson: 'Export JSON',
    form112Standard: 'MoHFW Form 112-IN Standard',
    exportRegistryCsv: 'Export Registry (CSV)',
    resolvedCases: 'Resolved Cases',
    resolutionRate: 'Resolution Rate',
    avgResponseLatency: 'Avg Response Latency',
    nationalBenchmark: 'vs 18 min national benchmark',
    goldenHourSLA: 'Golden Hour SLA Compliance',
    casesWithinTarget: 'cases within target (<8m)',
    hospitalErHandovers: 'Hospital ER Handovers',
    icuCathLabRes: 'ICU & Cath Lab Bed Reservations',
    milestoneDist: 'Response-Time Milestone Distribution',
    totalAnalyzed: 'Total Analyzed:',
    optimalImmediate: '< 5 mins (Optimal / Immediate)',
    withinTargetSla: '5 – 8 mins (Within Target SLA)',
    heavyCongestion: '> 8 mins (Heavy Congestion / Escalated)',
    casesWord: 'cases',
    categoryBreakdown: 'Incident Category Breakdown',
    eocMetro: 'Hyderabad Metro EOC',
    medicalCardiac: 'Medical & Cardiac',
    medicalCardiacSub: 'Defibrillator & ALS priority',
    fireHazmat: 'Fire & Hazmat',
    fireHazmatSub: 'Dual tender dispatch',
    highwayAccidents: 'Highway Accidents',
    highwayAccidentsSub: 'Hydraulic extrication & green corridor',
    womenSafetySos: 'Women Safety & SOS',
    womenSafetySosSub: 'SHE Team beacon intercept',

    // Hospital Beds Tab
    hospitalBedsTitle: 'Hospital Bed Booking & ICU Triage',
    hospitalBedsSubtitle: 'Reserve critical care beds in real-time.',
    heuristicsFilter: 'HEURISTICS FILTER ACTIVE',
    searchHospitals: 'Search hospitals...',
    allCategories: 'All',
    traumaCenter: 'Trauma Center',
    clinic: 'Clinic',
    bedsAvailable: 'beds available',
    bookBed: 'Book Bed',
    bookPriorityBed: 'Book Priority Bed',
    callDirect: 'Call Direct',
    icuBeds: 'ICU/Ventilator',
    cardiacBeds: 'Cardiac ICU',
    hduBeds: 'HDU',
    traumaBay: 'Trauma Bay',
    totalBeds: 'Total Beds',
    availableBeds: 'Available',
    allFacilities: 'ALL FACILITIES',
    traumaHospitals: 'TRAUMA HOSPITALS',
    urgentClinics: 'URGENT CLINICS',
    proximityLabel: 'PROXIMITY',
    icuBedsLabel: 'ICU BEDS',
    erWaitTimeLabel: 'ER WAIT TIME',
    availableWord: 'available',
    activeBedReservations: 'Active Hospital Bed Reservations',
    activeCount: 'Active',
    patientLabel: 'Patient:',
    bypassTokenLabel: 'Bypass Token:',
    bayLabel: 'Bay:',
    viewPassBtn: 'View Pass',
    mapRouteBtn: 'Map Route',

    // Blood Matcher Tab
    bloodMatcherTitle: 'National Blood Allocation & Cold-Chain Logistics',
    bloodMatcherSubtitle: 'Real-time blood bank inventory with cold-chain dispatch tracking.',
    selectBloodGroup: 'Select Blood Group',
    searchBloodBanks: 'Search blood banks...',
    unitsAvailable: 'units available',
    reserveBlood: 'Reserve Blood',
    coldChain: 'Cold Chain',
    unitsCount: 'Units',
    temperature: 'Temperature',
    coldChainSecuredBadge: 'COLD-CHAIN SECURED',
    filterByBloodGroup: 'FILTER REAL-TIME INVENTORY BY BLOOD GROUP',
    liveBiomarkerTelemetry: 'LIVE BIOMARKER TELEMETRY',
    availableReserveUnits: 'AVAILABLE RESERVE UNITS',
    unitsCriticalBadge: 'UNITS CRITICAL',
    reserveColdChainBtn: 'Reserve Cold-Chain Dispatch',
    activeBloodDispatches: 'Active Cold-Chain Blood Dispatches',
    transitTemp: 'Transit Temp:',
    lockStatus: 'Lock Status:',
    secured: 'SECURED',
    etaMin: 'ETA Min:',

    // Contacts Tab
    contactsTitle: 'Emergency Contacts & Directory',
    contactsSubtitle: 'Manage your personal emergency contacts and quick-dial services.',
    addContact: 'Add Contact',
    nationalHelplines: 'National Emergency Helplines',
    personalContacts: 'Personal Emergency Contacts',
    deleteContact: 'Delete',
    name: 'Full Name',
    phone: 'Phone Number',
    relation: 'Relation',
    addNewContact: 'Add New Contact',
    cancel: 'Cancel',
    save: 'Save',
    emergencyDirTitle: 'Emergency Directory & Lifeline Contacts',
    emergencyDirSubtitle: 'National helplines, hospital desks, and pre-authorized family SOS contacts.',
    addEmergencyContactBtn: 'Add Emergency Contact',
    govtHelplinesTitle: 'Government & Emergency Helplines (24/7 Toll-Free)',
    dialBtn: 'Dial',
    unifiedEmergencyName: 'Unified Emergency',
    unifiedEmergencyDesc: 'All-in-one Police, Fire, Ambulance',
    medicalAmbulanceName: 'Medical Ambulance',
    medicalAmbulanceDesc: 'Advanced & Basic Life Support',
    policeControlName: 'Police Control',
    policeControlDesc: 'Law enforcement & immediate rescue',
    fireRescueName: 'Fire & Rescue',
    fireRescueDesc: 'Fire tenders and chemical rescue',
    womenSafetyName: 'Women Safety / SHE Teams',
    womenSafetyDesc: 'Immediate anti-harassment patrol',
    childlineName: 'Childline Emergency',
    childlineDesc: 'Child protection & rescue',
    disasterMgmtName: 'Disaster Management',
    disasterMgmtDesc: 'Flood, storm & earthquake response',
    cyberCrimeName: 'Cyber Crime Helpline',
    cyberCrimeDesc: 'Financial fraud & cyber threats',
    smsGatewayTitle: 'Encrypted Emergency SMS Broadcast Gateway',
    smsGatewayDesc: 'Sends automated SMS with live GPS telemetry link to all trusted family contacts.',
    simulateSmsBtn: 'Simulate Live SMS Broadcast',
    smsPayloadTitle: 'SMS Payload Transmitted to Contacts:',
    myContactsTitle: 'My Authorized Emergency Contacts (Notified automatically during SOS)',

    // Settings Tab
    settingsTitle: 'Settings & Configuration',
    settingsSubtitle: 'Manage your emergency profile, language, and system preferences.',
    interfaceLanguage: 'Interface Language',
    languageDesc: 'Select language for dispatch instructions and voice triage.',
    audioAlerts: 'Emergency Audio Alerts',
    audioAlertsDesc: 'Test the high-priority dispatch siren tone and haptic vibration engine.',
    testSiren: 'Test Emergency Siren',
    stopSiren: 'Stop Siren',
    lowConnectivity: 'Low-Connectivity SMS Fallback',
    lowConnectivityDesc: 'When offline, SOS is queued and relayed via SMS to 112 gateway.',
    proximityAlerts: 'Proximity Alert Radius',
    proximityAlertsDesc: 'Receive alerts for incidents within selected radius.',
    medicalId: 'Medical ID & Donor Profile',
    medicalIdDesc: 'Critical medical info shared with first responders.',
    bloodGroup: 'Blood Group',
    allergies: 'Allergies',
    emergencyContactName: 'Emergency Contact',
    donorConsent: 'Organ Donor Consent',
    saveSettings: 'Save Settings',
    settingsSaved: 'Settings saved successfully!',
    platformSettingsTitle: 'Platform Settings & Safety Preferences',
    platformSettingsSubtitle: 'Customize audio alerts, language, low-bandwidth mode, and your Medical Emergency Profile.',
    settingsSavedMessage: 'Your emergency settings and Medical ID profile were saved successfully!',
    offlineModeTitle: 'Low-Connectivity / Offline Mode',
    offlineModeDesc: 'Automatically bundle GPS and symptom telemetry into SMS if internet connection is lost.',
    offlineActiveBadge: 'OFFLINE ACTIVE',
    onlineModeBadge: 'ONLINE MODE',
    geofenceTitle: 'Geofence Emergency Broadcasts',
    geofenceDesc: 'Alert me when critical accidents, chemical spills, or floods happen within:',
    medicalProfileTitle: 'Emergency Medical Profile (Offline Accessible)',
    encryptedLocally: 'Encrypted locally',
    universalDonor: 'Universal Donor',
    knownAllergies: 'Known Allergies',
    saveMedicalProfileBtn: 'Save Medical Profile',

    // Modals
    emergencyDispatchTitle: 'Emergency Dispatch Portal',
    bookBedModalTitle: 'Emergency ICU Bed Priority Reservation',
    contactNumber: 'Contact Number',
    reasonAdmission: 'Reason for Emergency Admission',
    bedCategory: 'Bed Category',
    confirmBedBooking: 'Confirm Priority Bed Reservation',
    priorityPassTitle: 'Priority ER Admission Pass',
    directEmergencyDesk: 'Direct Emergency Desk',
    reserveBloodModalTitle: 'Reserve Blood Units (Cold-Chain Dispatch)',
    unitsNeeded: 'Units Needed',
    urgencyLevel: 'Urgency Level',
    immediateSurgery: 'Immediate Surgery (Stat)',
    scheduledTrauma: 'Trauma Standby',
    destinationHospital: 'Destination Hospital',
    confirmBloodReservation: 'Confirm Cold-Chain Reservation',
    safetyGuideHeading: 'Emergency Preparedness & First-Aid Guide',
    incidentDossierTitle: 'Cryptographic Incident Audit Dossier',
    sha256Digest: 'SHA-256 Digest',
    dpdpCertified: 'DPDP Act 2023 Compliance Certified',
    incidentDispatchDetails: 'Incident Dispatch Details',

    // Extra tab titles
    icuTriageTitle: 'ICU & Hospital Bed Triage',
    icuTriageSubtitle: 'Real-time ICU & ER bed availability across Hyderabad Metro Area facilities.',
    nationalBloodTitle: 'National Blood Allocation & Cold-Chain',
    nationalBloodSubtitle: 'Live blood inventory with GPS-tracked cold-chain dispatch from certified depots.',
  },

  hi: {
    // App & Brand
    appTitle: 'लाइफलाइन इंडिया',
    tagline: 'अति-स्थानीय आपातकालीन प्रतिक्रिया मंच',
    fromTo: 'आपातकाल से सहायता तक 60 सेकंड से भी कम में',
    online: 'ऑनलाइन',
    offline: 'ऑफ़लाइन',
    liveBadge: 'लाइव',
    liveStockBadge: 'लाइव स्टॉक',

    // General & Common
    exitToDashboard: '← डैशबोर्ड पर वापस जाएं',
    close: 'बंद करें',
    back: 'पीछे',
    all: 'सभी',
    clear: 'साफ़ करें',
    justNow: 'अभी-अभी',
    minsAgo: 'मि. पहले',
    unread: 'अपठित',
    activeNotifications: 'सक्रिय सूचनाएं',
    searchPlaceholder: 'स्थान, अस्पताल, घटना या फ़ोन नंबर खोजें...',
    emergencyFacilitiesHeader: 'आपातकालीन सेवाएं एवं सुविधाएं',
    switchPerspective: 'दृष्टिकोण बदलें',
    citizenDashboard: 'नागरिक डैशबोर्ड',
    responderTerminal: 'रेस्पॉन्डर टर्मिनल',
    adminCommandCenter: 'एडमिन कमांड सेंटर',
    guidedDemo: '90-सेकंड लाइव डेमो',
    privacyTrustNav: 'गोपनीयता व सुरक्षा',
    trackLive: 'लाइव ट्रैक करें',
    total: 'कुल',
    statusLabel: 'स्थिति:',
    filterByIdOrAddress: 'ID या पते से खोजें...',
    emergencyWord: 'आपातकाल',
    assignedUnit: 'नियुक्त राहत दल',
    smartDispatching: 'स्मार्ट प्रेषण जारी...',

    // SOS
    sosButton: 'SOS के लिए 2 सेकंड दबाएं',
    sosHolding: 'दबाए रखें... रद्द करने के लिए छोड़ें',
    sosTriggered: 'SOS सक्रिय - सहायता भेजी जा रही है',
    silentSos: 'साइलेंट SOS (ट्रिपल टैप)',
    silentSosTip: 'महिला सुरक्षा या खतरे के समय गुप्त आपातकालीन संकेत',
    gpsLocked: 'GPS स्थान सुरक्षित (सटीक)',
    manualPin: 'स्थान बदलें',
    emergencyType: 'आपातकालीन श्रेणी चुनें',
    types: {
      Medical: 'चिकित्सा / दिल का दौरा',
      Fire: 'अग्निकांड / धुआं',
      Accident: 'सड़क दुर्घटना',
      Crime: 'अपराध / खतरा',
      'Women Safety': 'महिला सुरक्षा / शी टीम',
      Disaster: 'आपदा / बाढ़',
      'Animal Rescue': 'पशु बचाव'
    },
    voiceNote: 'बोलकर बताएं',
    voiceListening: 'सुन रहे हैं... (हिंदी, तेलुगु या अंग्रेजी में बोलें)',
    typeDescription: 'या समस्या विस्तार से लिखें...',
    submitEmergency: '112 / राहत दल को तुरंत भेजें',
    submitting: 'विश्लेषण व प्रेषण जारी...',
    eta: 'पहुंचने का अनुमानित समय',
    mins: 'मिनट',
    secs: 'सेकंड',
    statusSteps: {
      Reported: 'सूचना दर्ज',
      Verified: 'AI सत्यापित',
      Assigned: 'दल नियुक्त',
      'En Route': 'रास्ते में',
      Arrived: 'घटनास्थल पर पहुंचे',
      Hospitalizing: 'अस्पताल सुपुर्द',
      Resolved: 'सुरक्षित समाधान'
    },
    firstAidHeading: 'तत्काल प्राथमिक उपचार निर्देश',
    callResponder: 'राहत दल से बात करें',
    chatWithResponder: 'सीधा संवाद (चैट)',
    shareLiveTracking: 'लाइव लोकेशन भेजें (WhatsApp)',
    emergencyContacts: 'आपातकालीन संपर्क',
    contactsAlerted: 'परिवार के 3 संपर्कों को आपकी लाइव लोकेशन भेजी गई',
    quickDial: 'त्वरित हेल्पलाइन नंबर',
    offlineBanner: 'ऑफ़लाइन मोड: SOS कतार में सहेजा गया। 112 SMS रिले द्वारा भेजा जा रहा है।',
    goodSamaritanAlerted: 'निकटवर्ती गुड सेमेरिटन स्वयंसेवक सतर्क',
    privacyNotice: 'स्थान केवल सक्रिय आपातकाल के दौरान ही साझा किया जाता है।',
    roleCitizen: 'नागरिक ऐप',
    roleResponder: 'राहत दल (रेस्पॉन्डर)',
    roleAdmin: 'कमांड सेंटर',
    roleDemo: '90-सेकंड लाइव डेमो',
    privacyTrust: 'गोपनीयता व सुरक्षा',

    // Dashboard Sidebar Navigation
    nav: {
      home: 'होम',
      liveMap: 'लाइव मैप',
      incidents: 'घटनाएं',
      hospitalBeds: 'अस्पताल बेड',
      bloodMatcher: 'रक्त मिलान',
      history: 'इतिहास',
      emergencyContacts: 'आपातकालीन संपर्क',
      settings: 'सेटिंग्स',
    },

    // Top Nav Tabs
    tabs: {
      emergencySOS: 'आपातकालीन SOS',
      hospitalsER: 'अस्पताल व आपातकक्ष',
      bloodMatcher: 'रक्त मिलान',
      ambulanceFleet: 'एम्बुलेंस बेड़ा',
      careRecords: 'देखभाल रिकॉर्ड',
    },

    // Stay Safe Card
    staySafe: 'सुरक्षित रहें',
    staySafeDesc: 'तैयार रहें। अपने आस-पास की आपातकालीन सेवाओं को जानें।',
    learnMore: 'और जानें',

    // Home Tab - SOS Console
    emergencyConsole: 'आपातकालीन कंसोल',
    emergencyHeadline: 'आपातकाल?',
    pressHoldSOS: 'SOS दबाएं और रोकें',
    sosDescription: 'नजदीकी अस्पतालों, एम्बुलेंस और राहत दल को तुरंत सचेत करें। आपका स्थान आपातकालीन सेवाओं के साथ तुरंत साझा होगा।',
    activeMesh: 'सक्रिय',
    mesh: 'नेटवर्क',
    holdForSeconds: '5 सेकंड दबाए रखें',
    secondsLeft: 'सेकंड बाकी',
    orHold: 'या दबाएं',
    forSeconds: '5 सेकंड तक',
    locationSharedNote: 'आपका स्थान आपातकालीन सेवाओं के साथ तुरंत साझा होगा।',
    needTriageReport: 'विस्तृत ट्रायज रिपोर्ट चाहिए?',
    formReporting: 'फॉर्म रिपोर्टिंग',

    // Home - Emergency Contacts
    viewAll: 'सभी देखें',
    police: 'पुलिस',
    ambulance: 'एम्बुलेंस',
    fire: 'अग्निशमन',

    // Home - Map Section
    liveGrid: 'हैदराबाद लाइव ग्रिड',

    // Home - Response Progress
    responseProgress: 'प्रतिक्रिया प्रगति',
    viewDetails: 'विवरण देखें',

    // Home - Nearby Services
    nearbyServices: 'नजदीकी आपातकालीन सेवाएं',
    cityHospital: 'सिटी हॉस्पिटल',
    policeStation: 'पुलिस थाना',
    fireStation: 'अग्निशमन केंद्र',
    openAllDay: 'खुला • 24/7',
    quickHelp: 'त्वरित सहायता',
    quickHelpDesc: 'आपातकाल में? SOS बटन दबाएं या 108 पर कॉल करें।',
    quickHelpLearnMore: 'और जानें →',

    // Home - Incident Card
    inProgress: 'जारी है',
    medicalEmergency: 'चिकित्सा आपातकाल',
    banjaraHills: 'बंजारा हिल्स, हैदराबाद',
    critical: 'गंभीर',
    etaLabel: 'पहुंचने का समय',
    distanceLabel: 'दूरी',
    enRoute: 'रास्ते में',
    aiAssistedTriage: 'AI-सहायता प्राप्त ट्रायज',
    riskIndicators: 'जोखिम संकेतक',
    possibleLossOfConsciousness: 'चेतना खोने की संभावना',
    roadsideLocation: 'सड़क किनारे स्थान',
    trafficExposure: 'यातायात जोखिम',
    recommendedResponse: 'अनुशंसित प्रतिक्रिया',
    advancedMedical: 'उन्नत चिकित्सा प्रतिक्रिया',
    confidence: 'विश्वसनीयता',
    incidentTimeline: 'घटना समयरेखा',
    emergencyReported: 'आपातकाल दर्ज',
    locationConfirmed: 'स्थान पुष्टि',
    aiTriageCompleted: 'AI ट्रायज पूर्ण',
    responderAssigned: 'राहत दल नियुक्त',
    arrived: 'पहुंचे',
    arrivedAtLocation: 'घटनास्थल पर पहुंचे',

    // Incidents Tab
    incidentsTitle: 'सक्रिय एवं हालिया घटनाएं',
    incidentsSubtitle: 'रीयल-टाइम घटना फीड, गंभीरता वर्गीकरण और प्रेषण ट्रैकिंग।',
    searchIncidents: 'घटनाएं, ID, स्थान खोजें...',
    filterAll: 'सभी',
    filterActive: 'सक्रिय',
    filterResolved: 'समाधान हुए',
    filterCritical: 'गंभीर',
    filterHigh: 'उच्च',
    filterMedium: 'मध्यम',
    noIncidentsFound: 'कोई घटना नहीं मिली।',
    unassigned: 'अनिर्धारित',
    assignResponder: 'राहत दल असाइन करें',
    escalate: 'एस्केलेट करें',
    viewIncident: 'घटना देखें',

    // Map Tab
    activeResponseSector: 'सक्रिय प्रतिक्रिया क्षेत्र: ग्रेटर हैदराबाद मेट्रो',
    unitsOnline: 'यूनिट ऑनलाइन',
    allUnits: 'सभी यूनिट',
    alsAmbulance: '108 ALS',
    fireTenders: 'फायर टेंडर',
    policePatrols: 'पुलिस गश्त',
    hospitals: 'अस्पताल',
    triggerSOS: 'SOS ट्रिगर करें',
    activeDispatches: 'सक्रिय डिस्पैच',
    liveTelemetry: 'लाइव टेलीमेट्री',

    // History Tab
    historyTitle: 'आपातकालीन प्रतिक्रिया इतिहास एवं विश्लेषण',
    historySubtitle: 'क्रिप्टोग्राफिक अखंडता और DPDP अनुपालन के साथ व्यापक ऑडिट ट्रेल।',
    exportCSV: 'फॉर्म 112 CSV निर्यात करें',
    searchHistory: 'ID, प्रकार, स्थान, राहत दल से खोजें...',
    totalIncidents: 'कुल घटनाएं',
    avgResponseTime: 'औसत प्रतिक्रिया समय',
    slaCompliance: 'SLA अनुपालन',
    hospitalHandovers: 'अस्पताल हस्तांतरण',
    incidentId: 'घटना ID',
    type: 'प्रकार',
    severity: 'गंभीरता',
    status: 'स्थिति',
    reportedTime: 'रिपोर्ट समय',
    responseTime: 'प्रतिक्रिया समय',
    responder: 'राहत दल',
    viewDossier: 'डोजियर देखें',
    exportJson: 'JSON निर्यात करें',
    form112Standard: 'MoHFW फॉर्म 112-IN मानक',
    exportRegistryCsv: 'रजिस्ट्री निर्यात करें (CSV)',
    resolvedCases: 'समाधान हुए मामले',
    resolutionRate: 'समाधान दर',
    avgResponseLatency: 'औसत प्रतिक्रिया विलंबता',
    nationalBenchmark: 'बनाम 18 मिनट राष्ट्रीय बेंचमार्क',
    goldenHourSLA: 'गोल्डन ऑवर SLA अनुपालन',
    casesWithinTarget: 'लक्ष्य के भीतर मामले (<8 मिनट)',
    hospitalErHandovers: 'अस्पताल ER हस्तांतरण',
    icuCathLabRes: 'ICU एवं कैथ लैब बेड आरक्षण',
    milestoneDist: 'प्रतिक्रिया-समय मील का पत्थर वितरण',
    totalAnalyzed: 'कुल विश्लेषित:',
    optimalImmediate: '< 5 मिनट (सर्वोत्तम / तत्काल)',
    withinTargetSla: '5 – 8 मिनट (लक्ष्य SLA के भीतर)',
    heavyCongestion: '> 8 मिनट (भारी जाम / एस्केलेटेड)',
    casesWord: 'मामले',
    categoryBreakdown: 'घटना श्रेणी विवरण',
    eocMetro: 'हैदराबाद मेट्रो EOC',
    medicalCardiac: 'चिकित्सा एवं हृदय संबंधी',
    medicalCardiacSub: 'डिफाइब्रिलेटर और ALS प्राथमिकता',
    fireHazmat: 'आग एवं खतरनाक पदार्थ',
    fireHazmatSub: 'दोहरे टेंडर प्रेषण',
    highwayAccidents: 'राजमार्ग दुर्घटनाएं',
    highwayAccidentsSub: 'हाइड्रोलिक बचाव व ग्रीन कॉरिडोर',
    womenSafetySos: 'महिला सुरक्षा एवं SOS',
    womenSafetySosSub: 'शी टीम बीकन इंटरसेप्ट',

    // Hospital Beds Tab
    hospitalBedsTitle: 'अस्पताल बेड बुकिंग और ICU ट्रायज',
    hospitalBedsSubtitle: 'रीयल-टाइम में क्रिटिकल केयर बेड रिजर्व करें।',
    heuristicsFilter: 'ह्यूरिस्टिक्स फ़िल्टर सक्रिय',
    searchHospitals: 'अस्पताल खोजें...',
    allCategories: 'सभी',
    traumaCenter: 'ट्रॉमा सेंटर',
    clinic: 'क्लिनिक',
    bedsAvailable: 'बेड उपलब्ध',
    bookBed: 'बेड बुक करें',
    bookPriorityBed: 'प्राथमिकता बेड बुक करें',
    callDirect: 'सीधे कॉल करें',
    icuBeds: 'ICU/वेंटिलेटर',
    cardiacBeds: 'कार्डियक ICU',
    hduBeds: 'HDU',
    traumaBay: 'ट्रॉमा बे',
    totalBeds: 'कुल बेड',
    availableBeds: 'उपलब्ध',
    allFacilities: 'सभी सुविधाएं',
    traumaHospitals: 'ट्रॉमा अस्पताल',
    urgentClinics: 'त्वरित क्लिनिक',
    proximityLabel: 'निकटता',
    icuBedsLabel: 'ICU बेड',
    erWaitTimeLabel: 'ER प्रतीक्षा समय',
    availableWord: 'उपलब्ध',
    activeBedReservations: 'सक्रिय अस्पताल बेड आरक्षण',
    activeCount: 'सक्रिय',
    patientLabel: 'मरीज़:',
    bypassTokenLabel: 'बाईपास टोकन:',
    bayLabel: 'बे:',
    viewPassBtn: 'पास देखें',
    mapRouteBtn: 'मार्ग देखें',

    // Blood Matcher Tab
    bloodMatcherTitle: 'राष्ट्रीय रक्त आवंटन एवं कोल्ड-चेन लॉजिस्टिक्स',
    bloodMatcherSubtitle: 'कोल्ड-चेन डिस्पैच ट्रैकिंग के साथ रीयल-टाइम ब्लड बैंक इन्वेंटरी।',
    selectBloodGroup: 'रक्त समूह चुनें',
    searchBloodBanks: 'ब्लड बैंक खोजें...',
    unitsAvailable: 'यूनिट उपलब्ध',
    reserveBlood: 'रक्त आरक्षित करें',
    coldChain: 'कोल्ड चेन',
    unitsCount: 'यूनिट',
    temperature: 'तापमान',
    coldChainSecuredBadge: 'कोल्ड-चेन सुरक्षित',
    filterByBloodGroup: 'रक्त समूह द्वारा रीयल-टाइम इन्वेंटरी फ़िल्टर करें',
    liveBiomarkerTelemetry: 'लाइव बायोमार्कर टेलीमेट्री',
    availableReserveUnits: 'उपलब्ध आरक्षित यूनिट',
    unitsCriticalBadge: 'यूनिट गंभीर',
    reserveColdChainBtn: 'कोल्ड-चेन डिस्पैच आरक्षित करें',
    activeBloodDispatches: 'सक्रिय कोल्ड-चेन रक्त प्रेषण',
    transitTemp: 'पारगमन तापमान:',
    lockStatus: 'लॉक स्थिति:',
    secured: 'सुरक्षित',
    etaMin: 'पहुंच समय (मिनट):',

    // Contacts Tab
    contactsTitle: 'आपातकालीन संपर्क एवं निर्देशिका',
    contactsSubtitle: 'अपने व्यक्तिगत आपातकालीन संपर्क और त्वरित-डायल सेवाएं प्रबंधित करें।',
    addContact: 'संपर्क जोड़ें',
    nationalHelplines: 'राष्ट्रीय आपातकालीन हेल्पलाइन',
    personalContacts: 'व्यक्तिगत आपातकालीन संपर्क',
    deleteContact: 'हटाएं',
    name: 'पूरा नाम',
    phone: 'फ़ोन नंबर',
    relation: 'संबंध',
    addNewContact: 'नया संपर्क जोड़ें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    emergencyDirTitle: 'आपातकालीन निर्देशिका एवं लाइफलाइन संपर्क',
    emergencyDirSubtitle: 'राष्ट्रीय हेल्पलाइन, अस्पताल डेस्क और परिवार के अधिकृत SOS संपर्क।',
    addEmergencyContactBtn: 'आपातकालीन संपर्क जोड़ें',
    govtHelplinesTitle: 'सरकारी एवं आपातकालीन हेल्पलाइन (24/7 टोल-फ़्री)',
    dialBtn: 'डायल',
    unifiedEmergencyName: 'एकीकृत आपातकालीन सेवा',
    unifiedEmergencyDesc: 'पुलिस, अग्निशमन, एम्बुलेंस सब एक में',
    medicalAmbulanceName: 'चिकित्सा एम्बुलेंस',
    medicalAmbulanceDesc: 'उन्नत एवं बुनियादी जीवन रक्षक सहायता',
    policeControlName: 'पुलिस नियंत्रण कक्ष',
    policeControlDesc: 'कानून प्रवर्तन एवं तत्काल बचाव',
    fireRescueName: 'अग्निशमन एवं बचाव',
    fireRescueDesc: 'अग्निशमन दल और रासायनिक बचाव',
    womenSafetyName: 'महिला सुरक्षा / शी टीम्स',
    womenSafetyDesc: 'उत्पीड़न विरोधी तत्काल गश्त',
    childlineName: 'चाइल्डलाइन आपातकाल',
    childlineDesc: 'बाल संरक्षण एवं बचाव',
    disasterMgmtName: 'आपदा प्रबंधन',
    disasterMgmtDesc: 'बाढ़, तूफान और भूकंप प्रतिक्रिया',
    cyberCrimeName: 'साइबर अपराध हेल्पलाइन',
    cyberCrimeDesc: 'वित्तीय धोखाधड़ी और साइबर खतरे',
    smsGatewayTitle: 'एन्क्रिप्टेड आपातकालीन SMS प्रसारण गेटवे',
    smsGatewayDesc: 'सभी विश्वसनीय पारिवारिक संपर्कों को लाइव GPS लिंक के साथ स्वचालित SMS भेजता है।',
    simulateSmsBtn: 'लाइव SMS प्रसारण सिम्युलेट करें',
    smsPayloadTitle: 'संपर्कों को प्रेषित SMS पेलोड:',
    myContactsTitle: 'मेरे अधिकृत आपातकालीन संपर्क (SOS के दौरान स्वतः सूचित)',

    // Settings Tab
    settingsTitle: 'सेटिंग्स एवं कॉन्फ़िगरेशन',
    settingsSubtitle: 'अपनी आपातकालीन प्रोफ़ाइल, भाषा और सिस्टम प्राथमिकताएं प्रबंधित करें।',
    interfaceLanguage: 'इंटरफ़ेस भाषा',
    languageDesc: 'प्रेषण निर्देशों और वॉयस ट्रायज के लिए भाषा चुनें।',
    audioAlerts: 'आपातकालीन ऑडियो अलर्ट',
    audioAlertsDesc: 'उच्च-प्राथमिकता प्रेषण सायरन टोन और हैप्टिक वाइब्रेशन का परीक्षण करें।',
    testSiren: 'आपातकालीन सायरन परखें',
    stopSiren: 'सायरन बंद करें',
    lowConnectivity: 'कम-कनेक्टिविटी SMS फ़ॉलबैक',
    lowConnectivityDesc: 'ऑफ़लाइन होने पर SOS कतार में सहेजा जाता है और 112 गेटवे को SMS के माध्यम से रिले किया जाता है।',
    proximityAlerts: 'निकटता अलर्ट त्रिज्या',
    proximityAlertsDesc: 'चयनित त्रिज्या के भीतर घटनाओं के लिए अलर्ट प्राप्त करें।',
    medicalId: 'मेडिकल ID एवं दाता प्रोफ़ाइल',
    medicalIdDesc: 'प्रथम राहत दल के साथ साझा की गई महत्वपूर्ण चिकित्सा जानकारी।',
    bloodGroup: 'रक्त समूह',
    allergies: 'एलर्जी',
    emergencyContactName: 'आपातकालीन संपर्क',
    donorConsent: 'अंग दाता सहमति',
    saveSettings: 'सेटिंग्स सहेजें',
    settingsSaved: 'सेटिंग्स सफलतापूर्वक सहेजी गईं!',
    platformSettingsTitle: 'प्लेटफ़ॉर्म सेटिंग्स एवं सुरक्षा प्राथमिकताएं',
    platformSettingsSubtitle: 'ऑडियो अलर्ट, भाषा, कम-बैंडविड्थ मोड और अपनी मेडिकल प्रोफ़ाइल को कस्टमाइज़ करें।',
    settingsSavedMessage: 'आपकी आपातकालीन सेटिंग्स और मेडिकल ID प्रोफ़ाइल सफलतापूर्वक सहेजी गईं!',
    offlineModeTitle: 'कम-कनेक्टिविटी / ऑफ़लाइन मोड',
    offlineModeDesc: 'इंटरनेट कनेक्शन कटने पर स्वचालित रूप से GPS और लक्षणों को SMS में बंडल करें।',
    offlineActiveBadge: 'ऑफ़लाइन सक्रिय',
    onlineModeBadge: 'ऑनलाइन मोड',
    geofenceTitle: 'जियोफ़ेंस आपातकालीन प्रसारण',
    geofenceDesc: 'चयनित दायरे में गंभीर दुर्घटनाएं, रसायन रिसाव या बाढ़ आने पर सचेत करें:',
    medicalProfileTitle: 'आपातकालीन मेडिकल प्रोफ़ाइल (ऑफ़लाइन सुलभ)',
    encryptedLocally: 'स्थानीय रूप से एन्क्रिप्टेड',
    universalDonor: 'सर्वदाता',
    knownAllergies: 'ज्ञात एलर्जी',
    saveMedicalProfileBtn: 'मेडिकल प्रोफ़ाइल सहेजें',

    // Modals
    emergencyDispatchTitle: 'आपातकालीन प्रेषण पोर्टल',
    bookBedModalTitle: 'आपातकालीन ICU बेड प्राथमिकता आरक्षण',
    contactNumber: 'संपर्क नंबर',
    reasonAdmission: 'आपातकालीन भर्ती का कारण',
    bedCategory: 'बेड श्रेणी',
    confirmBedBooking: 'प्राथमिकता बेड आरक्षण की पुष्टि करें',
    priorityPassTitle: 'प्राथमिकता ER प्रवेश पास',
    directEmergencyDesk: 'सीधा आपातकालीन डेस्क',
    reserveBloodModalTitle: 'रक्त यूनिट आरक्षित करें (कोल्ड-चेन प्रेषण)',
    unitsNeeded: 'आवश्यक यूनिट',
    urgencyLevel: 'तात्कालिकता स्तर',
    immediateSurgery: 'तत्काल सर्जरी (STAT)',
    scheduledTrauma: 'ट्रॉमा स्टैंडबाय',
    destinationHospital: 'गंतव्य अस्पताल',
    confirmBloodReservation: 'कोल्ड-चेन आरक्षण की पुष्टि करें',
    safetyGuideHeading: 'आपातकालीन तत्परता एवं प्राथमिक उपचार गाइड',
    incidentDossierTitle: 'क्रिप्टोग्राफिक घटना ऑडिट डोजियर',
    sha256Digest: 'SHA-256 डाइजेस्ट',
    dpdpCertified: 'DPDP अधिनियम 2023 अनुपालन प्रमाणित',
    incidentDispatchDetails: 'घटना प्रेषण विवरण',

    // Extra tab titles
    icuTriageTitle: 'ICU एवं अस्पताल बेड ट्रियाज',
    icuTriageSubtitle: 'हैदराबाद मेट्रो क्षेत्र की सुविधाओं में रियल-टाइम ICU और ER बेड उपलब्धता।',
    nationalBloodTitle: 'राष्ट्रीय रक्त आवंटन एवं कोल्ड-चेन',
    nationalBloodSubtitle: 'प्रमाणित डिपो से GPS-ट्रैक्ड कोल्ड-चेन प्रेषण के साथ लाइव रक्त भंडार।',
  },

  te: {
    // App & Brand
    appTitle: 'లైఫ్‌లైన్ ఇండియా',
    tagline: 'హైపర్‌లోకల్ అత్యవసర స్పందన వేదిక',
    fromTo: 'అత్యవసర క్షణం నుండి రక్షకుడి వరకు 60 సెకన్లలోపు',
    online: 'ఆన్‌లైన్',
    offline: 'ఆఫ్‌లైన్',
    liveBadge: 'లైవ్',
    liveStockBadge: 'లైవ్ స్టాక్',

    // General & Common
    exitToDashboard: '← డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి',
    close: 'మూసివేయి',
    back: 'వెనుకకు',
    all: 'అన్నీ',
    clear: 'క్లియర్ చేయండి',
    justNow: 'ఇప్పుడే',
    minsAgo: 'నిమి. క్రితం',
    unread: 'చదవనివి',
    activeNotifications: 'యాక్టివ్ నోటిఫికేషన్లు',
    searchPlaceholder: 'స్థానం, ఆసుపత్రి, సంఘటన లేదా ఫోన్ నంబర్ వెతకండి...',
    emergencyFacilitiesHeader: 'అత్యవసర సేవలు & సౌకర్యాలు',
    switchPerspective: 'వీక్షణను మార్చండి',
    citizenDashboard: 'పౌరుల డ్యాష్‌బోర్డ్',
    responderTerminal: 'రెస్పాండర్ టెర్మినల్',
    adminCommandCenter: 'అడ్మిన్ కమాండ్ సెంటర్',
    guidedDemo: '90-సెకన్ల లైవ్ డెమో',
    privacyTrustNav: 'గోప్యత & భద్రత',
    trackLive: 'లైవ్ ట్రాక్ చేయండి',
    total: 'మొత్తం',
    statusLabel: 'స్థితి:',
    filterByIdOrAddress: 'ID లేదా చిరునామాతో శోధించండి...',
    emergencyWord: 'అత్యవసరం',
    assignedUnit: 'కేటాయించిన వాహనం',
    smartDispatching: 'స్మార్ట్ డిస్పాచ్ అవుతోంది...',

    // SOS
    sosButton: 'SOS కోసం 2 సెకన్లు నొక్కి ఉంచండి',
    sosHolding: 'నొక్కి ఉంచండి... రద్దు చేయడానికి వదలండి',
    sosTriggered: 'SOS ప్రారంభించబడింది - రెస్పాండర్ బయలుదేరారు',
    silentSos: 'సైలెంట్ SOS (ట్రిపుల్ ట్యాప్)',
    silentSosTip: 'మహిళా రక్షణ లేదా ప్రమాద సమయంలో నిశ్శబ్ద అత్యవసర సందేశం',
    gpsLocked: 'GPS లొకేషన్ ఖచ్చితంగా నమోదైంది',
    manualPin: 'లొకేషన్ సర్దుబాటు',
    emergencyType: 'అత్యవసర రకాన్ని ఎంచుకోండి',
    types: {
      Medical: 'వైద్యం / గుండెపోటు',
      Fire: 'అగ్నిప్రమాదం',
      Accident: 'రోడ్డు ప్రమాదం',
      Crime: 'నేరం / అపాయం',
      'Women Safety': 'మహిళా భద్రత / SHE బృందం',
      Disaster: 'వరదలు / విపత్తు',
      'Animal Rescue': 'జంతు రక్షణ'
    },
    voiceNote: 'వాయిస్ ద్వారా చెప్పండి',
    voiceListening: 'వింటున్నాము... (తెలుగు, హిందీ లేదా ఇంగ్లీషులో మాట్లాడండి)',
    typeDescription: 'లేదా ఇక్కడ వివరించండి...',
    submitEmergency: '112 రెస్పాండర్‌కు తక్షణమే పంపండి',
    submitting: 'విశ్లేషిస్తున్నాం...',
    eta: 'చేరుకునే సమయం (ETA)',
    mins: 'నిమిషాలు',
    secs: 'సెకన్లు',
    statusSteps: {
      Reported: 'ఫిర్యాదు అందింది',
      Verified: 'AI ధృవీకరించింది',
      Assigned: 'రెస్పాండర్ కేటాయింపు',
      'En Route': 'వస్తున్నారు',
      Arrived: 'ఘటనా స్థలానికి చేరారు',
      Hospitalizing: 'ఆసుపత్రికి చేరవేత',
      Resolved: 'పరిష్కరించబడింది'
    },
    firstAidHeading: 'తక్షణ ప్రథమ చికిత్స మార్గదర్శకాలు',
    callResponder: 'రెస్పాండర్‌కు కాల్ చేయండి',
    chatWithResponder: 'లైవ్ చాట్',
    shareLiveTracking: 'లైవ్ లొకేషన్ షేర్ చేయండి (WhatsApp)',
    emergencyContacts: 'అత్యవసర కాంటాక్ట్‌లు',
    contactsAlerted: 'మీ కుటుంబ సభ్యులకు లైవ్ లొకేషన్ మెసేజ్ పంపబడింది',
    quickDial: 'ముఖ్యమైన అత్యవసర నంబర్లు',
    offlineBanner: 'ఆఫ్‌లైన్ మోడ్: SOS దాచబడింది. 112 గేట్‌వేకి SMS ద్వారా పంపబడుతుంది.',
    goodSamaritanAlerted: 'సమీపంలోని వాలంటీర్లు అప్రమత్తమయ్యారు',
    privacyNotice: 'మీ లొకేషన్ ప్రమాదం ముగిసిన వెంటనే ఆటోమేటిక్‌గా తొలగించబడుతుంది.',
    roleCitizen: 'పౌరుల యాప్',
    roleResponder: 'రెస్పాండర్ యాప్',
    roleAdmin: 'కమాండ్ సెంటర్',
    roleDemo: '90-సెకన్ల లైవ్ డెమో',
    privacyTrust: 'గోప్యత & భద్రత',

    // Dashboard Sidebar Navigation
    nav: {
      home: 'హోమ్',
      liveMap: 'లైవ్ మ్యాప్',
      incidents: 'సంఘటనలు',
      hospitalBeds: 'ఆసుపత్రి బెడ్లు',
      bloodMatcher: 'రక్తం మ్యాచర్',
      history: 'చరిత్ర',
      emergencyContacts: 'అత్యవసర కాంటాక్ట్‌లు',
      settings: 'సెట్టింగ్స్',
    },

    // Top Nav Tabs
    tabs: {
      emergencySOS: 'అత్యవసర SOS',
      hospitalsER: 'ఆసుపత్రులు & ER',
      bloodMatcher: 'రక్తం మ్యాచర్',
      ambulanceFleet: 'యాంబులెన్స్ వాహనాలు',
      careRecords: 'సంరక్షణ రికార్డులు',
    },

    // Stay Safe Card
    staySafe: 'సురక్షితంగా ఉండండి',
    staySafeDesc: 'సిద్ధంగా ఉండండి. మీ సమీపంలోని అత్యవసర సేవలను తెలుసుకోండి.',
    learnMore: 'మరింత తెలుసుకోండి',

    // Home Tab - SOS Console
    emergencyConsole: 'అత్యవసర కన్సోల్',
    emergencyHeadline: 'అత్యవసరమా?',
    pressHoldSOS: 'SOS నొక్కి పట్టుకోండి',
    sosDescription: 'సమీపంలోని ఆసుపత్రులు, యాంబులెన్స్ మరియు రెస్పాండర్లను వెంటనే అప్రమత్తం చేయండి. మీ లొకేషన్ అత్యవసర సేవలతో వెంటనే షేర్ అవుతుంది.',
    activeMesh: 'యాక్టివ్',
    mesh: 'మెష్',
    holdForSeconds: '5 సెకన్లు నొక్కి ఉంచండి',
    secondsLeft: 'సెకన్లు మిగిలాయి',
    orHold: 'లేదా నొక్కండి',
    forSeconds: '5 సెకన్లు',
    locationSharedNote: 'మీ లొకేషన్ అత్యవసర సేవలతో వెంటనే షేర్ అవుతుంది.',
    needTriageReport: 'వివరణాత్మక ట్రయాజ్ నివేదిక కావాలా?',
    formReporting: 'ఫారమ్ రిపోర్టింగ్',

    // Home - Emergency Contacts
    viewAll: 'అన్నీ చూడండి',
    police: 'పోలీసు',
    ambulance: 'యాంబులెన్స్',
    fire: 'అగ్నిమాపక',

    // Home - Map Section
    liveGrid: 'హైదరాబాద్ లైవ్ గ్రిడ్',

    // Home - Response Progress
    responseProgress: 'స్పందన పురోగతి',
    viewDetails: 'వివరాలు చూడండి',

    // Home - Nearby Services
    nearbyServices: 'సమీపంలోని అత్యవసర సేవలు',
    cityHospital: 'సిటీ హాస్పిటల్',
    policeStation: 'పోలీసు స్టేషన్',
    fireStation: 'అగ్నిమాపక కేంద్రం',
    openAllDay: 'తెరవబడింది • 24/7',
    quickHelp: 'త్వరిత సహాయం',
    quickHelpDesc: 'అత్యవసరంలో? SOS బటన్ నొక్కండి లేదా 108కు కాల్ చేయండి.',
    quickHelpLearnMore: 'మరింత తెలుసుకోండి →',

    // Home - Incident Card
    inProgress: 'కొనసాగుతోంది',
    medicalEmergency: 'వైద్య అత్యవసరం',
    banjaraHills: 'బంజారా హిల్స్, హైదరాబాద్',
    critical: 'క్రిటికల్',
    etaLabel: 'చేరే సమయం',
    distanceLabel: 'దూరం',
    enRoute: 'వస్తున్నారు',
    aiAssistedTriage: 'AI-సహాయ ట్రయాజ్',
    riskIndicators: 'ప్రమాద సూచికలు',
    possibleLossOfConsciousness: 'స్పృహ కోల్పోయే అవకాశం',
    roadsideLocation: 'రోడ్డు పక్క స్థానం',
    trafficExposure: 'ట్రాఫిక్ ప్రమాదం',
    recommendedResponse: 'సిఫార్సు చేసిన స్పందన',
    advancedMedical: 'అధునాతన వైద్య స్పందన',
    confidence: 'విశ్వాసం',
    incidentTimeline: 'సంఘటన కాలక్రమం',
    emergencyReported: 'అత్యవసరం నివేదించబడింది',
    locationConfirmed: 'లొకేషన్ నిర్ధారించబడింది',
    aiTriageCompleted: 'AI ట్రయాజ్ పూర్తయింది',
    responderAssigned: 'రెస్పాండర్ కేటాయించబడ్డారు',
    arrived: 'చేరారు',
    arrivedAtLocation: 'స్థానానికి చేరారు',

    // Incidents Tab
    incidentsTitle: 'యాక్టివ్ & ఇటీవలి సంఘటనలు',
    incidentsSubtitle: 'రియల్-టైమ్ సంఘటన ఫీడ్, తీవ్రత వర్గీకరణ మరియు డిస్పాచ్ ట్రాకింగ్.',
    searchIncidents: 'సంఘటనలు, ID, స్థానం వెతకండి...',
    filterAll: 'అన్నీ',
    filterActive: 'యాక్టివ్',
    filterResolved: 'పరిష్కరించబడినవి',
    filterCritical: 'క్రిటికల్',
    filterHigh: 'హై',
    filterMedium: 'మీడియం',
    noIncidentsFound: 'మీ ఫిల్టర్లకు సంఘటనలు లేవు.',
    unassigned: 'కేటాయించలేదు',
    assignResponder: 'రెస్పాండర్ కేటాయించండి',
    escalate: 'ఎస్కలేట్ చేయండి',
    viewIncident: 'సంఘటన చూడండి',

    // Map Tab
    activeResponseSector: 'యాక్టివ్ స్పందన రంగం: గ్రేటర్ హైదరాబాద్ మెట్రో',
    unitsOnline: 'యూనిట్లు ఆన్‌లైన్',
    allUnits: 'అన్ని యూనిట్లు',
    alsAmbulance: '108 ALS',
    fireTenders: 'ఫైర్ టెండర్లు',
    policePatrols: 'పోలీసు పెట్రోల్',
    hospitals: 'ఆసుపత్రులు',
    triggerSOS: 'SOS ట్రిగ్గర్ చేయండి',
    activeDispatches: 'యాక్టివ్ డిస్పాచ్‌లు',
    liveTelemetry: 'లైవ్ టెలిమెట్రీ',

    // History Tab
    historyTitle: 'అత్యవసర స్పందన చరిత్ర & విశ్లేషణలు',
    historySubtitle: 'క్రిప్టోగ్రాఫిక్ సమగ్రత మరియు DPDP సమ్మతితో సమగ్ర ఆడిట్ ట్రయల్.',
    exportCSV: 'ఫారమ్ 112 CSV ఎగుమతి',
    searchHistory: 'ID, రకం, స్థానం, రెస్పాండర్ వెతకండి...',
    totalIncidents: 'మొత్తం సంఘటనలు',
    avgResponseTime: 'సగటు స్పందన సమయం',
    slaCompliance: 'SLA సమ్మతి',
    hospitalHandovers: 'ఆసుపత్రి హ్యాండోవర్లు',
    incidentId: 'సంఘటన ID',
    type: 'రకం',
    severity: 'తీవ్రత',
    status: 'స్థితి',
    reportedTime: 'నివేదించిన సమయం',
    responseTime: 'స్పందన సమయం',
    responder: 'రెస్పాండర్',
    viewDossier: 'డాజియర్ చూడండి',
    exportJson: 'JSON ఎగుమతి',
    form112Standard: 'MoHFW ఫారమ్ 112-IN ప్రమాణం',
    exportRegistryCsv: 'రిజిస్ట్రీ ఎగుమతి (CSV)',
    resolvedCases: 'పరిష్కరించబడిన కేసులు',
    resolutionRate: 'పరిష్కార రేటు',
    avgResponseLatency: 'సగటు స్పందన ఆలస్యం',
    nationalBenchmark: '18 నిమిషాల జాతీయ ప్రామాణికంతో పోలిస్తే',
    goldenHourSLA: 'గోల్డెన్ అవర్ SLA సమ్మతి',
    casesWithinTarget: 'లక్ష్యం లోపల కేసులు (<8ని)',
    hospitalErHandovers: 'ఆసుపత్రి ER బదిలీలు',
    icuCathLabRes: 'ICU మరియు క్యాథ్ ల్యాబ్ బెడ్ రిజర్వేషన్లు',
    milestoneDist: 'స్పందన-సమయ మైలురాయి పంపిణీ',
    totalAnalyzed: 'మొత్తం విశ్లేషించబడినవి:',
    optimalImmediate: '< 5 నిమిషాలు (ఉత్తమ / తక్షణ)',
    withinTargetSla: '5 – 8 నిమిషాలు (లక్ష్య SLA పరిధిలో)',
    heavyCongestion: '> 8 నిమిషాలు (ట్రాఫిక్ రద్దీ / ఎస్కలేటెడ్)',
    casesWord: 'కేసులు',
    categoryBreakdown: 'సంఘటనల కేటగిరీ విభజన',
    eocMetro: 'హైదరాబాద్ మెట్రో EOC',
    medicalCardiac: 'వైద్యం & గుండె సంబంధిత',
    medicalCardiacSub: 'డీఫైబ్రిలేటర్ & ALS ప్రాధాన్యత',
    fireHazmat: 'అగ్నిప్రమాదం & విషవాయువు',
    fireHazmatSub: 'ద్వంద్వ టెండర్ డిస్పాచ్',
    highwayAccidents: 'హైవే ప్రమాదాలు',
    highwayAccidentsSub: 'హైడ్రాలిక్ ఎక్స్‌ట్రికేషన్ & గ్రీన్ కారిడార్',
    womenSafetySos: 'మహిళా భద్రత & SOS',
    womenSafetySosSub: 'SHE టీమ్ బీకాన్ ఇంటర్‌సెప్ట్',

    // Hospital Beds Tab
    hospitalBedsTitle: 'ఆసుపత్రి బెడ్ బుకింగ్ & ICU ట్రయాజ్',
    hospitalBedsSubtitle: 'రియల్-టైమ్‌లో క్రిటికల్ కేర్ బెడ్లు రిజర్వ్ చేయండి.',
    heuristicsFilter: 'హ్యూరిస్టిక్స్ ఫిల్టర్ యాక్టివ్',
    searchHospitals: 'ఆసుపత్రులు వెతకండి...',
    allCategories: 'అన్నీ',
    traumaCenter: 'ట్రామా సెంటర్',
    clinic: 'క్లినిక్',
    bedsAvailable: 'బెడ్లు అందుబాటులో',
    bookBed: 'బెడ్ బుక్ చేయండి',
    bookPriorityBed: 'ప్రాధాన్యత బెడ్ బుక్ చేయండి',
    callDirect: 'నేరుగా కాల్ చేయండి',
    icuBeds: 'ICU/వెంటిలేటర్',
    cardiacBeds: 'కార్డియాక్ ICU',
    hduBeds: 'HDU',
    traumaBay: 'ట్రామా బే',
    totalBeds: 'మొత్తం బెడ్లు',
    availableBeds: 'అందుబాటులో',
    allFacilities: 'అన్ని ఆసుపత్రులు',
    traumaHospitals: 'ట్రామా ఆసుపత్రులు',
    urgentClinics: 'అత్యవసర క్లినిక్‌లు',
    proximityLabel: 'సామీప్యత',
    icuBedsLabel: 'ICU బెడ్లు',
    erWaitTimeLabel: 'ER వేచి ఉండే సమయం',
    availableWord: 'అందుబాటులో',
    activeBedReservations: 'యాక్టివ్ ఆసుపత్రి బెడ్ రిజర్వేషన్లు',
    activeCount: 'యాక్టివ్',
    patientLabel: 'రోగి:',
    bypassTokenLabel: 'బైపాస్ టోకెన్:',
    bayLabel: 'బే:',
    viewPassBtn: 'పాస్ చూడండి',
    mapRouteBtn: 'రూట్ చూడండి',

    // Blood Matcher Tab
    bloodMatcherTitle: 'జాతీయ రక్త కేటాయింపు & కోల్డ్-చెయిన్ లాజిస్టిక్స్',
    bloodMatcherSubtitle: 'కోల్డ్-చెయిన్ డిస్పాచ్ ట్రాకింగ్‌తో రియల్-టైమ్ బ్లడ్ బ్యాంక్ ఇన్వెంటరీ.',
    selectBloodGroup: 'రక్తపు గ్రూప్ ఎంచుకోండి',
    searchBloodBanks: 'బ్లడ్ బ్యాంకులు వెతకండి...',
    unitsAvailable: 'యూనిట్లు అందుబాటులో',
    reserveBlood: 'రక్తం రిజర్వ్ చేయండి',
    coldChain: 'కోల్డ్ చెయిన్',
    unitsCount: 'యూనిట్లు',
    temperature: 'ఉష్ణోగ్రత',
    coldChainSecuredBadge: 'కోల్డ్-చెయిన్ భద్రపరచబడింది',
    filterByBloodGroup: 'రక్త గ్రూప్ ప్రకారం ఇన్వెంటరీని ఫిల్టర్ చేయండి',
    liveBiomarkerTelemetry: 'లైవ్ బయోమార్కర్ టెలిమెట్రీ',
    availableReserveUnits: 'అందుబాటులో ఉన్న రిజర్వ్ యూనిట్లు',
    unitsCriticalBadge: 'యూనిట్లు అత్యవసరం',
    reserveColdChainBtn: 'కోల్డ్-చెయిన్ రవాణా రిజర్వ్ చేయండి',
    activeBloodDispatches: 'యాక్టివ్ కోల్డ్-చెయిన్ బ్లడ్ డిస్పాచ్‌లు',
    transitTemp: 'రవాణా ఉష్ణోగ్రత:',
    lockStatus: 'లాక్ స్థితి:',
    secured: 'సురక్షితం',
    etaMin: 'చేరే సమయం (నిమి):',

    // Contacts Tab
    contactsTitle: 'అత్యవసర కాంటాక్ట్‌లు & డైరెక్టరీ',
    contactsSubtitle: 'మీ వ్యక్తిగత అత్యవసర కాంటాక్ట్‌లు మరియు క్విక్-డయల్ సేవలు నిర్వహించండి.',
    addContact: 'కాంటాక్ట్ జోడించండి',
    nationalHelplines: 'జాతీయ అత్యవసర హెల్ప్‌లైన్లు',
    personalContacts: 'వ్యక్తిగత అత్యవసర కాంటాక్ట్‌లు',
    deleteContact: 'తొలగించండి',
    name: 'పూర్తి పేరు',
    phone: 'ఫోన్ నంబర్',
    relation: 'సంబంధం',
    addNewContact: 'కొత్త కాంటాక్ట్ జోడించండి',
    cancel: 'రద్దు చేయండి',
    save: 'సేవ్ చేయండి',
    emergencyDirTitle: 'అత్యవసర డైరెక్టరీ & లైఫ్‌లైన్ కాంటాక్ట్‌లు',
    emergencyDirSubtitle: 'జాతీయ హెల్ప్‌లైన్లు, ఆసుపత్రి డెస్క్‌లు మరియు కుటుంబ SOS కాంటాక్ట్‌లు.',
    addEmergencyContactBtn: 'అత్యవసర కాంటాక్ట్ జోడించండి',
    govtHelplinesTitle: 'ప్రభుత్వ & అత్యవసర హెల్ప్‌లైన్లు (24/7 ఉచితం)',
    dialBtn: 'కాల్ చేయండి',
    unifiedEmergencyName: 'సమీకృత అత్యవసర సేవ',
    unifiedEmergencyDesc: 'పోలీస్, ఫైర్, అంబులెన్స్ అన్నీ ఒకే నంబర్‌లో',
    medicalAmbulanceName: 'వైద్య యాంబులెన్స్',
    medicalAmbulanceDesc: 'అధునాతన మరియు ప్రాథమిక ప్రాణరక్షణ సేవలు',
    policeControlName: 'పోలీస్ కంట్రోల్ రూమ్',
    policeControlDesc: 'చట్ట అమలు మరియు తక్షణ రక్షణ',
    fireRescueName: 'ఫైర్ & రెస్క్యూ',
    fireRescueDesc: 'అగ్నిమాపక వాహనాలు మరియు రసాయన రక్షణ',
    womenSafetyName: 'మహిళా భద్రత / SHE బృందాలు',
    womenSafetyDesc: 'వేధింపుల నిరోధక తక్షణ పెట్రోలింగ్',
    childlineName: 'చైల్డ్‌లైన్ అత్యవసర సేవ',
    childlineDesc: 'పిల్లల సంరక్షణ మరియు రక్షణ',
    disasterMgmtName: 'విపత్తు నిర్వహణ',
    disasterMgmtDesc: 'వరదలు, తుఫాను మరియు భూకంప స్పందన',
    cyberCrimeName: 'సైబర్ క్రైమ్ హెల్ప్‌లైన్',
    cyberCrimeDesc: 'ఆర్థిక మోసాలు మరియు సైబర్ బెదిరింపులు',
    smsGatewayTitle: 'ఎన్‌క్రిప్టెడ్ ఎమర్జెన్సీ SMS ప్రసార గేట్‌వే',
    smsGatewayDesc: 'నమ్మకమైన కుటుంబ సభ్యులందరికీ లైవ్ GPS లింక్‌తో ఆటోమేటిక్ SMS పంపుతుంది.',
    simulateSmsBtn: 'లైవ్ SMS ప్రసారాన్ని సిమ్యులేట్ చేయండి',
    smsPayloadTitle: 'కాంటాక్ట్‌లకు పంపిన SMS వివరాలు:',
    myContactsTitle: 'నా అధికారిక అత్యవసర కాంటాక్ట్‌లు (SOS సమయంలో ఆటోమేటిక్‌గా పంపబడును)',

    // Settings Tab
    settingsTitle: 'సెట్టింగ్స్ & కాన్ఫిగరేషన్',
    settingsSubtitle: 'మీ అత్యవసర ప్రొఫైల్, భాష మరియు సిస్టమ్ ప్రాధాన్యతలు నిర్వహించండి.',
    interfaceLanguage: 'ఇంటర్ఫేస్ భాష',
    languageDesc: 'డిస్పాచ్ సూచనలు మరియు వాయిస్ ట్రయాజ్ కోసం భాష ఎంచుకోండి.',
    audioAlerts: 'అత్యవసర ఆడియో అలర్ట్‌లు',
    audioAlertsDesc: 'అధిక-ప్రాధాన్యత డిస్పాచ్ సైరన్ టోన్ మరియు హాప్టిక్ వైబ్రేషన్ పరీక్షించండి.',
    testSiren: 'అత్యవసర సైరన్ పరీక్షించండి',
    stopSiren: 'సైరన్ ఆపండి',
    lowConnectivity: 'తక్కువ-కనెక్టివిటీ SMS ఫాల్‌బ్యాక్',
    lowConnectivityDesc: 'ఆఫ్‌లైన్‌లో ఉన్నప్పుడు, SOS క్యూలో సేవ్ అవుతుంది మరియు 112 గేట్‌వేకి SMS ద్వారా పంపబడుతుంది.',
    proximityAlerts: 'సమీప్య అలర్ట్ రేడియస్',
    proximityAlertsDesc: 'ఎంచుకున్న రేడియస్‌లో సంఘటనలకు అలర్ట్‌లు అందుకోండి.',
    medicalId: 'మెడికల్ ID & డోనర్ ప్రొఫైల్',
    medicalIdDesc: 'మొదటి రెస్పాండర్లతో షేర్ చేయబడిన ముఖ్యమైన వైద్య సమాచారం.',
    bloodGroup: 'రక్తపు గ్రూప్',
    allergies: 'అలెర్జీలు',
    emergencyContactName: 'అత్యవసర కాంటాక్ట్',
    donorConsent: 'అవయవ దాత సమ్మతి',
    saveSettings: 'సెట్టింగ్స్ సేవ్ చేయండి',
    settingsSaved: 'సెట్టింగ్స్ విజయవంతంగా సేవ్ అయ్యాయి!',
    platformSettingsTitle: 'ప్లాట్‌ఫారమ్ సెట్టింగ్స్ & భద్రతా ప్రాధాన్యతలు',
    platformSettingsSubtitle: 'ఆడియో అలర్ట్‌లు, భాష, తక్కువ-బ్యాండ్‌విడ్త్ మోడ్ మరియు మెడికల్ ప్రొఫైల్‌ను సర్దుబాటు చేయండి.',
    settingsSavedMessage: 'మీ అత్యవసర సెట్టింగ్స్ మరియు మెడికల్ ID ప్రొఫైల్ విజయవంతంగా సేవ్ చేయబడ్డాయి!',
    offlineModeTitle: 'తక్కువ-కనెక్టివిటీ / ఆఫ్‌లైన్ మోడ్',
    offlineModeDesc: 'ఇంటర్నెట్ కనెక్షన్ లేనప్పుడు GPS మరియు లక్షణాలను SMS రూపంలో పంపండి.',
    offlineActiveBadge: 'ఆఫ్‌లైన్ యాక్టివ్',
    onlineModeBadge: 'ఆన్‌లైన్ మోడ్',
    geofenceTitle: 'జియోఫెన్స్ అత్యవసర ప్రసారాలు',
    geofenceDesc: 'ఎంచుకున్న పరిధిలో ప్రమాదాలు, రసాయన లీక్‌లు లేదా వరదలు సంభవించినప్పుడు నన్ను అప్రమత్తం చేయండి:',
    medicalProfileTitle: 'అత్యవసర మెడికల్ ప్రొఫైల్ (ఆఫ్‌లైన్ అందుబాటు)',
    encryptedLocally: 'స్థానికంగా భద్రపరచబడింది',
    universalDonor: 'సార్వత్రిక దాత',
    knownAllergies: 'తెలిసిన అలెర్జీలు',
    saveMedicalProfileBtn: 'మెడికల్ ప్రొఫైల్ సేవ్ చేయండి',

    // Modals
    emergencyDispatchTitle: 'అత్యవసర డిస్పాచ్ పోర్టల్',
    bookBedModalTitle: 'అత్యవసర ICU బెడ్ ప్రాధాన్యత రిజర్వేషన్',
    contactNumber: 'సంప్రదింపు నంబర్',
    reasonAdmission: 'చేరడానికి అత్యవసర కారణం',
    bedCategory: 'బెడ్ వర్గం',
    confirmBedBooking: 'ప్రాధాన్యత బెడ్ రిజర్వేషన్ నిర్ధారించండి',
    priorityPassTitle: 'ప్రాధాన్యత ER ప్రవేశ పాస్',
    directEmergencyDesk: 'డైరెక్ట్ ఎమర్జెన్సీ డెస్క్',
    reserveBloodModalTitle: 'రక్త యూనిట్లు రిజర్వ్ చేయండి (కోల్డ్-చెయిన్ డిస్పాచ్)',
    unitsNeeded: 'అవసరమైన యూనిట్లు',
    urgencyLevel: 'అత్యవసర స్థాయి',
    immediateSurgery: 'తక్షణ శస్త్రచికిత్స (STAT)',
    scheduledTrauma: 'ట్రామా స్టాండ్‌బై',
    destinationHospital: 'చేరవలసిన ఆసుపత్రి',
    confirmBloodReservation: 'కోల్డ్-చెయిన్ రిజర్వేషన్ నిర్ధారించండి',
    safetyGuideHeading: 'అత్యవసర సన్నద్ధత మరియు ప్రథమ చికిత్స గైడ్',
    incidentDossierTitle: 'క్రిప్టోగ్రాఫిక్ సంఘటన ఆడిట్ డాజియర్',
    sha256Digest: 'SHA-256 డైజెస్ట్',
    dpdpCertified: 'DPDP చట్టం 2023 సమ్మతి ధృవీకరించబడింది',
    incidentDispatchDetails: 'సంఘటన డిస్పాచ్ వివరాలు',

    // Extra tab titles
    icuTriageTitle: 'ICU & ఆసుపత్రి బెడ్ ట్రయాజ్',
    icuTriageSubtitle: 'హైదరాబాద్ మెట్రో ప్రాంతంలో రియల్-టైమ్ ICU & ER బెడ్ లభ్యత.',
    nationalBloodTitle: 'జాతీయ రక్త కేటాయింపు & కోల్డ్-చెయిన్',
    nationalBloodSubtitle: 'ధృవీకరించబడిన డిపోల నుండి GPS-ట్రాక్ చేయబడిన కోల్డ్-చెయిన్ డిస్పాచ్‌తో లైవ్ రక్త నిల్వ.',
  },

  mr: {
    // App & Brand
    appTitle: 'लाईफलाईन इंडिया',
    tagline: 'हायपरलोकल आपत्कालीन प्रतिसाद मंच',
    fromTo: 'आपत्कालीन स्थितीपासून मदतीपर्यंत ६० सेकंदांच्या आत',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    liveBadge: 'थेट (LIVE)',
    liveStockBadge: 'थेट साठा',

    // General & Common
    exitToDashboard: '← डॅशबोर्डवर परत जा',
    close: 'बंद करा',
    back: 'मागे',
    all: 'सर्व',
    clear: 'साफ करा',
    justNow: 'आत्ताच',
    minsAgo: 'मि. पूर्वी',
    unread: 'न वाचलेले',
    activeNotifications: 'सक्रिय सूचना',
    searchPlaceholder: 'स्थान, रुग्णालय, घटना किंवा फोन शोधा...',
    emergencyFacilitiesHeader: 'आपत्कालीन सेवा आणि सुविधा',
    switchPerspective: 'दृष्टिकोन बदला',
    citizenDashboard: 'नागरिक डॅशबोर्ड',
    responderTerminal: 'प्रतिसादक टर्मिनल',
    adminCommandCenter: 'प्रशासक नियंत्रण केंद्र',
    guidedDemo: '९०-सेकंद थेट डेमो',
    privacyTrustNav: 'गोपनीयता आणि सुरक्षा',
    trackLive: 'थेट ट्रॅक करा',
    total: 'एकूण',
    statusLabel: 'स्थिती:',
    filterByIdOrAddress: 'आयडी किंवा पत्त्यानुसार शोधा...',
    emergencyWord: 'आपत्कालीन',
    assignedUnit: 'नेमलेले पथक',
    smartDispatching: 'स्मार्ट प्रेषण सुरू आहे...',

    // SOS
    sosButton: 'SOS साठी २ सेकंद दाबून ठेवा',
    sosHolding: 'दाबून ठेवा... रद्द करण्यासाठी सोडा',
    sosTriggered: 'SOS सक्रिय - मदत पाठवली जात आहे',
    silentSos: 'शांत SOS (तीनदा टॅप करा)',
    silentSosTip: 'महिला सुरक्षा किंवा धोक्याच्या वेळी गुप्त आपत्कालीन इशारा',
    gpsLocked: 'GPS स्थान निश्चित (अचूक)',
    manualPin: 'स्थान समायोजित करा',
    emergencyType: 'आपत्कालीन प्रकार निवडा',
    types: {
      Medical: 'वैद्यकीय / हृदयविकार',
      Fire: 'आग / स्फोट',
      Accident: 'रस्ता अपघात',
      Crime: 'गुन्हा / धोका',
      'Women Safety': 'महिला सुरक्षा / निर्भया पथक',
      Disaster: 'आपत्ती / पूर',
      'Animal Rescue': 'प्राणी बचाव'
    },
    voiceNote: 'बोलून संदेश द्या',
    voiceListening: 'ऐकत आहोत... (मराठी, हिंदी किंवा इंग्रजीमध्ये बोला)',
    typeDescription: 'किंवा आपत्कालीन परिस्थितीचे तपशील लिहा...',
    submitEmergency: '११२ / प्रतिसादकांना आपत्कालीन इशारा पाठवा',
    submitting: 'विश्लेषण आणि प्रेषण सुरू आहे...',
    eta: 'पोहोचण्याची अंदाजे वेळ (ETA)',
    mins: 'मिनिटे',
    secs: 'सेकंद',
    statusSteps: {
      Reported: 'नोंदवले गेले',
      Verified: 'AI प्रमाणित',
      Assigned: 'पथक नेमले',
      'En Route': 'मार्गावर',
      Arrived: 'घटनास्थळी पोहोचले',
      Hospitalizing: 'रुग्णालय हस्तांतरण',
      Resolved: 'सुरक्षित निवारण'
    },
    firstAidHeading: 'त्वरित प्रथमोपचार सूचना',
    callResponder: 'प्रतिसादकाला कॉल करा',
    chatWithResponder: 'थेट संवाद (चॅट)',
    shareLiveTracking: 'थेट GPS पाठवा (WhatsApp)',
    emergencyContacts: 'आपत्कालीन संपर्क',
    contactsAlerted: 'कुटुंबातील ३ संपर्कांना तुमचे थेट स्थान पाठवले आहे',
    quickDial: 'राष्ट्रीय त्वरित हेल्पलाइन',
    offlineBanner: 'ऑफलाइन मोड: SOS रांगेत ठेवले. ११२ गेटवेवर SMS द्वारे पाठवले जात आहे.',
    goodSamaritanAlerted: 'जवळचे देवदूत स्वयंसेवक सावध झाले',
    privacyNotice: 'स्थान केवळ सक्रिय आपत्कालीन काळातच सामायिक केले जाते. निवारणानंतर डेटा नष्ट केला जातो.',
    roleCitizen: 'नागरिक ॲप',
    roleResponder: 'प्रतिसादक टर्मिनल',
    roleAdmin: 'कमांड सेंटर',
    roleDemo: '९०-सेकंद थेट डेमो',
    privacyTrust: 'गोपनीयता आणि सुरक्षा',

    // Dashboard Sidebar Navigation
    nav: {
      home: 'मुख्यपृष्ठ',
      liveMap: 'थेट नकाशा',
      incidents: 'घटना',
      hospitalBeds: 'रुग्णालय खाटा',
      bloodMatcher: 'रक्त जुळवणी',
      history: 'इतिहास',
      emergencyContacts: 'आपत्कालीन संपर्क',
      settings: 'सेटिंग्ज',
    },

    // Top Nav Tabs
    tabs: {
      emergencySOS: 'आपत्कालीन SOS',
      hospitalsER: 'रुग्णालये व आपत्कालीन कक्ष',
      bloodMatcher: 'रक्त जुळवणी',
      ambulanceFleet: 'रुग्णवाहिका ताफा',
      careRecords: 'आरोग्य नोंदी',
    },

    // Stay Safe Card
    staySafe: 'सुरक्षित राहा',
    staySafeDesc: 'सज्ज राहा. तुमच्या परिसरातील आपत्कालीन सेवांची माहिती ठेवा.',
    learnMore: 'अधिक जाणून घ्या',

    // Home Tab - SOS Console
    emergencyConsole: 'आपत्कालीन कन्सोल',
    emergencyHeadline: 'आपत्कालीन परिस्थिती?',
    pressHoldSOS: 'SOS दाबा आणि धरून ठेवा',
    sosDescription: 'नजीकच्या रुग्णालये, रुग्णवाहिका आणि मदत पथकांना त्वरित सावध करा. तुमचे स्थान आपत्कालीन सेवांशी त्वरित शेअर केले जाईल.',
    activeMesh: 'सक्रिय',
    mesh: 'नेटवर्क',
    holdForSeconds: '५ सेकंद दाबून ठेवा',
    secondsLeft: 'सेकंद शिल्लक',
    orHold: 'किंवा दाबा',
    forSeconds: '५ सेकंदांसाठी',
    locationSharedNote: 'तुमचे स्थान आपत्कालीन सेवांशी त्वरित शेअर केले जाईल.',
    needTriageReport: 'सविस्तर ट्रायज अहवाल हवा आहे?',
    formReporting: 'फॉर्मद्वारे तक्रार',

    // Home - Emergency Contacts
    viewAll: 'सर्व पहा',
    police: 'पोलीस',
    ambulance: 'रुग्णवाहिका',
    fire: 'अग्निशामक',

    // Home - Map Section
    liveGrid: 'हैदराबाद थेट ग्रिड',

    // Home - Response Progress
    responseProgress: 'प्रतिसाद प्रगती',
    viewDetails: 'तपशील पहा',

    // Home - Nearby Emergency Services
    nearbyServices: 'नजीकच्या आपत्कालीन सेवा',
    cityHospital: 'सिटी हॉस्पिटल',
    policeStation: 'पोलीस स्टेशन',
    fireStation: 'अग्निशामक केंद्र',
    openAllDay: 'उघडे • २४/७',
    quickHelp: 'त्वरित मदत',
    quickHelpDesc: 'आपत्कालीन परिस्थितीत? SOS बटण दाबा किंवा १०८ वर कॉल करा.',
    quickHelpLearnMore: 'अधिक जाणून घ्या →',

    // Home - Incident Card (Right)
    inProgress: 'सुरू आहे',
    medicalEmergency: 'वैद्यकीय आणीबाणी',
    banjaraHills: 'बंजारा हिल्स, हैदराबाद',
    critical: 'गंभीर',
    etaLabel: 'पोहोचण्याची वेळ',
    distanceLabel: 'अंतर',
    enRoute: 'मार्गावर',
    aiAssistedTriage: 'AI-सहाय्यित ट्रायज',
    riskIndicators: 'धोका निर्देशक',
    possibleLossOfConsciousness: 'शुद्ध हरपण्याची शक्यता',
    roadsideLocation: 'रस्त्यावरील स्थान',
    trafficExposure: 'वाहतूक अडथळा धोका',
    recommendedResponse: 'शिफारस केलेला प्रतिसाद',
    advancedMedical: 'प्रगत वैद्यकीय प्रतिसाद',
    confidence: 'विश्वासार्हता',
    incidentTimeline: 'घटना कालरेषा',
    emergencyReported: 'आपत्कालीन नोंद झाली',
    locationConfirmed: 'स्थान निश्चित झाले',
    aiTriageCompleted: 'AI ट्रायज पूर्ण',
    responderAssigned: 'प्रतिसादक नेमला गेला',
    arrived: 'पोहोचले',
    arrivedAtLocation: 'घटनास्थळी पोहोचले',

    // Incidents Tab
    incidentsTitle: 'सक्रिय आणि अलीकडील घटना',
    incidentsSubtitle: 'थेट घटना प्रवाह, तीव्रता वर्गीकरण आणि पाठवणी ट्रॅकिंग.',
    searchIncidents: 'घटना, आयडी, स्थान शोधा...',
    filterAll: 'सर्व',
    filterActive: 'सक्रिय',
    filterResolved: 'निवारण झालेले',
    filterCritical: 'अतिगंभीर',
    filterHigh: 'उच्च',
    filterMedium: 'मध्यम',
    noIncidentsFound: 'कोणतीही घटना आढळली नाही.',
    unassigned: 'अनियुक्त',
    assignResponder: 'प्रतिसादक नियुक्त करा',
    escalate: 'उच्च पातळीवर कळवा (एस्केलेट)',
    viewIncident: 'घटना पहा',

    // Map Tab
    activeResponseSector: 'सक्रिय प्रतिसाद क्षेत्र: ग्रेटर हैदराबाद मेट्रो',
    unitsOnline: 'पथके ऑनलाइन',
    allUnits: 'सर्व पथके',
    alsAmbulance: '१०८ ALS रुग्णवाहिका',
    fireTenders: 'अग्निशामक बंब',
    policePatrols: 'पोलीस गस्त',
    hospitals: 'रुग्णालये',
    triggerSOS: 'SOS पाठवा',
    activeDispatches: 'सक्रिय प्रेषण',
    liveTelemetry: 'थेट टेलिमेट्री',

    // History Tab
    historyTitle: 'आपत्कालीन प्रतिसाद इतिहास आणि विश्लेषण',
    historySubtitle: 'क्रिप्टोग्राफिक अखंडता आणि DPDP सह संपूर्ण ऑडिट नोंद.',
    exportCSV: 'फॉर्म ११२ CSV निर्यात',
    searchHistory: 'आयडी, प्रकार, स्थान, प्रतिसादकानुसार शोधा...',
    totalIncidents: 'एकूण घटना',
    avgResponseTime: 'सरासरी प्रतिसाद वेळ',
    slaCompliance: 'SLA अनुपालन',
    hospitalHandovers: 'रुग्णालय हस्तांतरण',
    incidentId: 'घटना आयडी',
    type: 'प्रकार',
    severity: 'तीव्रता',
    status: 'स्थिती',
    reportedTime: 'नोंद वेळ',
    responseTime: 'प्रतिसाद वेळ',
    responder: 'प्रतिसादक',
    viewDossier: 'दस्तऐवज पहा',
    exportJson: 'JSON निर्यात करा',
    form112Standard: 'MoHFW फॉर्म ११२-IN मानक',
    exportRegistryCsv: 'नोंदवही निर्यात करा (CSV)',
    resolvedCases: 'निवारण झालेली प्रकरणे',
    resolutionRate: 'निवारण दर',
    avgResponseLatency: 'सरासरी प्रतिसाद विलंब',
    nationalBenchmark: 'विरुद्ध १८ मिनिटे राष्ट्रीय मानक',
    goldenHourSLA: 'गोल्डन अवर SLA अनुपालन',
    casesWithinTarget: 'लक्ष्यांतर्गत प्रकरणे (<८ मि)',
    hospitalErHandovers: 'रुग्णालय ER हस्तांतरणे',
    icuCathLabRes: 'ICU आणि कॅथ लॅब खाट आरक्षणे',
    milestoneDist: 'प्रतिसाद वेळ टप्पा वितरण',
    totalAnalyzed: 'एकूण विश्लेषण:',
    optimalImmediate: '< ५ मिनिटे (उत्कृष्ट / त्वरित)',
    withinTargetSla: '५ – ८ मिनिटे (लक्ष्य SLA अंतर्गत)',
    heavyCongestion: '> ८ मिनिटे (जास्त वाहतूक / एस्केलेटेड)',
    casesWord: 'प्रकरणे',
    categoryBreakdown: 'घटना श्रेणी वर्गीकरण',
    eocMetro: 'हैदराबाद मेट्रो EOC',
    medicalCardiac: 'वैद्यकीय आणि हृदयविकार',
    medicalCardiacSub: 'डिफिब्रिलेटर आणि ALS प्राधान्य',
    fireHazmat: 'आग आणि घातक रसायने',
    fireHazmatSub: 'दुहेरी बंब प्रेषण',
    highwayAccidents: 'महामार्ग अपघात',
    highwayAccidentsSub: 'हायड्रॉलिक बचाव व ग्रीन कॉरिडोअर',
    womenSafetySos: 'महिला सुरक्षा आणि SOS',
    womenSafetySosSub: 'निर्भया पथक बीकन इंटरसेप्ट',

    // Hospital Beds Tab
    hospitalBedsTitle: 'रुग्णालय खाट आरक्षण आणि ICU ट्रायज',
    hospitalBedsSubtitle: 'तातडीच्या काळजी खाटा रिअल-टाइममध्ये आरक्षित करा.',
    heuristicsFilter: 'ह्युरिस्टिक्स फिल्टर सक्रिय',
    searchHospitals: 'रुग्णालये शोधा...',
    allCategories: 'सर्व',
    traumaCenter: 'ट्रॉमा सेंटर',
    clinic: 'क्लिनिक',
    bedsAvailable: 'खाटा उपलब्ध',
    bookBed: 'खाट आरक्षित करा',
    bookPriorityBed: 'प्राधान्य खाट आरक्षित करा',
    callDirect: 'थेट संपर्क साधा',
    icuBeds: 'ICU / व्हेंटिलेटर',
    cardiacBeds: 'हृदयविकार ICU',
    hduBeds: 'HDU',
    traumaBay: 'ट्रॉमा बे',
    totalBeds: 'एकूण खाटा',
    availableBeds: 'उपलब्ध खाटा',
    allFacilities: 'सर्व सुविधा',
    traumaHospitals: 'ट्रॉमा रुग्णालये',
    urgentClinics: 'तातडीची क्लिनिक्स',
    proximityLabel: 'जवळचे अंतर',
    icuBedsLabel: 'ICU खाटा',
    erWaitTimeLabel: 'ER प्रतीक्षा वेळ',
    availableWord: 'उपलब्ध',
    activeBedReservations: 'सक्रिय रुग्णालय खाट आरक्षणे',
    activeCount: 'सक्रिय',
    patientLabel: 'रुग्ण:',
    bypassTokenLabel: 'बायपास टोकन:',
    bayLabel: 'बे क्रमांक:',
    viewPassBtn: 'पास पहा',
    mapRouteBtn: 'मार्ग दाखवा',

    // Blood Matcher Tab
    bloodMatcherTitle: 'राष्ट्रीय रक्त वाटप आणि कोल्ड-चेन लॉजिस्टिक्स',
    bloodMatcherSubtitle: 'कोल्ड-चेन ट्रॅकिंगसह रिअल-टाइम रक्तपेढी साठा.',
    selectBloodGroup: 'रक्तगट निवडा',
    searchBloodBanks: 'रक्तपेढ्या शोधा...',
    unitsAvailable: 'युनिट्स उपलब्ध',
    reserveBlood: 'रक्त आरक्षित करा',
    coldChain: 'कोल्ड चेन',
    unitsCount: 'युनिट्स',
    temperature: 'तापमान',
    coldChainSecuredBadge: 'कोल्ड-चेन सुरक्षित',
    filterByBloodGroup: 'रक्तगटानुसार थेट साठा फिल्टर करा',
    liveBiomarkerTelemetry: 'थेट बायोमार्कर टेलिमेट्री',
    availableReserveUnits: 'उपलब्ध राखीव युनिट्स',
    unitsCriticalBadge: 'साठा कमी / गंभीर',
    reserveColdChainBtn: 'कोल्ड-चेन प्रेषण आरक्षित करा',
    activeBloodDispatches: 'सक्रिय कोल्ड-चेन रक्त प्रेषण',
    transitTemp: 'वाहतूक तापमान:',
    lockStatus: 'कुलूप स्थिती:',
    secured: 'सुरक्षित',
    etaMin: 'पोहोचण्याची वेळ (मि):',

    // Contacts Tab
    contactsTitle: 'आपत्कालीन संपर्क आणि डिरेक्टरी',
    contactsSubtitle: 'तुमचे वैयक्तिक आपत्कालीन संपर्क आणि त्वरित हेल्पलाइन व्यवस्थापित करा.',
    addContact: 'संपर्क जोडा',
    nationalHelplines: 'राष्ट्रीय आपत्कालीन हेल्पलाइन',
    personalContacts: 'वैयक्तिक आपत्कालीन संपर्क',
    deleteContact: 'हटवा',
    name: 'पूर्ण नाव',
    phone: 'फोन नंबर',
    relation: 'नाते / संबंध',
    addNewContact: 'नवीन संपर्क जोडा',
    cancel: 'रद्द करा',
    save: 'जतन करा',
    emergencyDirTitle: 'आपत्कालीन डिरेक्टरी आणि लाइफलाइन संपर्क',
    emergencyDirSubtitle: 'सरकारी हेल्पलाइन, रुग्णालय डेस्क आणि कुटुंबातील अधिकृत SOS संपर्क.',
    addEmergencyContactBtn: 'आपत्कालीन संपर्क जोडा',
    govtHelplinesTitle: 'सरकारी आणि आपत्कालीन हेल्पलाइन (२४/७ टोल-फ्री)',
    dialBtn: 'कॉल करा',
    unifiedEmergencyName: 'एकीकृत आपत्कालीन सेवा',
    unifiedEmergencyDesc: 'पोलीस, अग्निशामक, रुग्णवाहिका सर्व एकत्र',
    medicalAmbulanceName: 'वैद्यकीय रुग्णवाहिका',
    medicalAmbulanceDesc: 'प्रगत आणि प्राथमिक जीवन रक्षक सेवा',
    policeControlName: 'पोलीस नियंत्रण कक्ष',
    policeControlDesc: 'कायदा अंमलबजावणी आणि त्वरित सुटका',
    fireRescueName: 'अग्निशामक आणि बचाव',
    fireRescueDesc: 'अग्निशामक पथके आणि रासायनिक बचाव',
    womenSafetyName: 'महिला सुरक्षा / निर्भया पथक',
    womenSafetyDesc: 'छळवणूक प्रतिबंधक त्वरित गस्त',
    childlineName: 'चाइल्डलाइन आपत्कालीन',
    childlineDesc: 'बाल संरक्षण आणि बचाव',
    disasterMgmtName: 'आपत्ती व्यवस्थापन',
    disasterMgmtDesc: 'पूर, वादळ आणि भूकंप प्रतिसाद',
    cyberCrimeName: 'सायबर गुन्हे हेल्पलाइन',
    cyberCrimeDesc: 'आर्थिक फसवणूक आणि सायबर धमक्या',
    smsGatewayTitle: 'एन्क्रिप्टेड आपत्कालीन SMS प्रसारण गेटवे',
    smsGatewayDesc: 'थेट GPS लिंकसह सर्व विश्वासू कौटुंबिक संपर्कांना स्वयंचलित SMS पाठवतो.',
    simulateSmsBtn: 'थेट SMS प्रसारण तपासा',
    smsPayloadTitle: 'संपर्कांना पाठवलेला SMS संदेश:',
    myContactsTitle: 'माझे अधिकृत आपत्कालीन संपर्क (SOS वेळी आपोआप सावध केले जातील)',

    // Settings Tab
    settingsTitle: 'सेटिंग्ज आणि संरचना',
    settingsSubtitle: 'तुमचे आपत्कालीन प्रोफाईल, भाषा आणि प्रणाली प्राधान्ये व्यवस्थापित करा.',
    interfaceLanguage: 'इंटरफेस भाषा',
    languageDesc: 'प्रेषण सूचना आणि व्हॉइस ट्रायजसाठी भाषा निवडा.',
    audioAlerts: 'आपत्कालीन ऑडिओ इशारे',
    audioAlertsDesc: 'उच्च-प्राधान्य सायरन टोन आणि व्हायब्रेशन तपासा.',
    testSiren: 'आपत्कालीन सायरन तपासा',
    stopSiren: 'सायरन बंद करा',
    lowConnectivity: 'कमी नेटवर्क SMS पर्याय',
    lowConnectivityDesc: 'ऑफलाइन असताना, SOS रांगेत ठेवून ११२ गेटवेवर SMS द्वारे पाठवले जाते.',
    proximityAlerts: 'परिसर इशारा त्रिज्या',
    proximityAlertsDesc: 'निवडलेल्या त्रिज्येतील घटनांसाठी इशारे मिळवा.',
    medicalId: 'वैद्यकीय आयडी आणि अवयवदाता प्रोफाईल',
    medicalIdDesc: 'प्रथम प्रतिसादकांसाठी महत्त्वाची वैद्यकीय माहिती.',
    bloodGroup: 'रक्तगट',
    allergies: 'ॲलर्जी',
    emergencyContactName: 'आपत्कालीन संपर्क',
    donorConsent: 'अवयवदान संमती',
    saveSettings: 'सेटिंग्ज जतन करा',
    settingsSaved: 'सेटिंग्ज यशस्वीरित्या जतन केल्या!',
    platformSettingsTitle: 'प्लॅटफॉर्म सेटिंग्ज आणि सुरक्षा प्राधान्ये',
    platformSettingsSubtitle: 'ऑडिओ इशारे, भाषा, कमी-बँडविड्थ मोड आणि तुमचे वैद्यकीय प्रोफाईल सानुकूलित करा.',
    settingsSavedMessage: 'तुमच्या आपत्कालीन सेटिंग्ज आणि वैद्यकीय प्रोफाईल यशस्वीरित्या जतन झाले आहे!',
    offlineModeTitle: 'कमी-कनेक्टिव्हिटी / ऑफलाइन मोड',
    offlineModeDesc: 'इंटरनेट बंद असल्यास GPS आणि लक्षणे आपोआप SMS मध्ये रूपांतरित करा.',
    offlineActiveBadge: 'ऑफलाइन सक्रिय',
    onlineModeBadge: 'ऑनलाइन मोड',
    geofenceTitle: 'जिओफेन्स आपत्कालीन प्रसारण',
    geofenceDesc: 'निवडलेल्या परिसरात मोठे अपघात, वायू गळती किंवा पूर आल्यास सावध करा:',
    medicalProfileTitle: 'आपत्कालीन वैद्यकीय प्रोफाईल (ऑफलाइन उपलब्ध)',
    encryptedLocally: 'स्थानिक पातळीवर एन्क्रिप्टेड',
    universalDonor: 'सर्वयोग्य दाता',
    knownAllergies: 'माहित असलेल्या ॲलर्जी',
    saveMedicalProfileBtn: 'वैद्यकीय प्रोफाईल जतन करा',

    // Modals
    emergencyDispatchTitle: 'आपत्कालीन प्रेषण पोर्टल',
    bookBedModalTitle: 'आपत्कालीन ICU खाट प्राधान्य आरक्षण',
    contactNumber: 'संपर्क क्रमांक',
    reasonAdmission: 'दाखल होण्याचे आपत्कालीन कारण',
    bedCategory: 'खाट वर्ग',
    confirmBedBooking: 'प्राधान्य खाट आरक्षण निश्चित करा',
    priorityPassTitle: 'प्राधान्य ER प्रवेश पास',
    directEmergencyDesk: 'थेट आपत्कालीन डेस्क',
    reserveBloodModalTitle: 'रक्त युनिट्स आरक्षित करा (कोल्ड-चेन प्रेषण)',
    unitsNeeded: 'आवश्यक युनिट्स',
    urgencyLevel: 'तातडीची पातळी',
    immediateSurgery: 'त्वरित शस्त्रक्रिया (STAT)',
    scheduledTrauma: 'ट्रॉमा स्टँडबाय',
    destinationHospital: 'गंतव्य रुग्णालय',
    confirmBloodReservation: 'कोल्ड-चेन आरक्षण निश्चित करा',
    safetyGuideHeading: 'आपत्कालीन सज्जता आणि प्रथमोपचार मार्गदर्शक',
    incidentDossierTitle: 'क्रिप्टोग्राफिक घटना ऑडिट दस्तऐवज',
    sha256Digest: 'SHA-256 डायजेस्ट',
    dpdpCertified: 'DPDP कायदा २०२३ अनुपालन प्रमाणित',
    incidentDispatchDetails: 'घटना प्रेषण तपशील',

    // Extra tab titles
    icuTriageTitle: 'ICU आणि रुग्णालय खाट ट्रायज',
    icuTriageSubtitle: 'हैदराबाद मेट्रो क्षेत्रातील रुग्णालयांमध्ये थेट ICU आणि ER खाटांची उपलब्धता.',
    nationalBloodTitle: 'राष्ट्रीय रक्त वाटप आणि कोल्ड-चेन',
    nationalBloodSubtitle: 'प्रमाणित डेपोमधून GPS-ट्रॅक केलेल्या कोल्ड-चेन प्रेषणासह थेट रक्त साठा.',
  }
};

import React, { useState, useRef, useEffect } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { Language } from '../../utils/i18n';
import { sound } from '../../utils/audio';
import { 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Bot, 
  RotateCcw, 
  ExternalLink,
  Globe
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
  action?: {
    label: string;
    actionType: 'role_switch' | 'tab_switch' | 'lang_switch';
    value: string;
  };
}

export const EmergencyChatbot: React.FC = () => {
  const { 
    currentLanguage, 
    setLanguage, 
    setActiveRole, 
  } = useEmergency();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [hasUnread, setHasUnread] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initial welcome message localized to the user's selected language
  const getInitialWelcome = (): string => {
    if (currentLanguage === 'hi') {
      return `नमस्ते! मैं लाइफलाइन AI हूँ — आपका 24/7 आपातकालीन एवं प्लेटफ़ॉर्म सहायक।\n\nमैं इस प्लेटफ़ॉर्म के बारे में सब कुछ जानता हूँ। आप मुझसे पूछ सकते हैं:\n• SOS और साइलेंट बीकन कैसे काम करता है?\n• ICU और वेंटिलेटर बेड कैसे बुक करें?\n• दुर्लभ रक्त समूह (O-) और कोल्ड-चेन रक्त कहाँ मिलेगा?\n• राष्ट्रीय आपातकालीन हेल्पलाइन (112, 108, 100, 1091)\n• DPDP 2023 डेटा सुरक्षा और PII मास्किंग`;
    }
    if (currentLanguage === 'te') {
      return `నమస్కారం! నేను లైఫ్‌లైన్ AI — మీ 24/7 అత్యవసర మరియు ప్లాట్‌ఫారమ్ గైడ్.\n\nఈ ప్లాట్‌ఫారమ్ గురించి ఏ సమాచారమైనా నన్ను అడగవచ్చు:\n• SOS ఎలా పని చేస్తుంది?\n• ICU & వెంటిలేటర్ బెడ్ల రిజర్వేషన్ ఎలా?\n• బ్లడ్ బ్యాంక్ మరియు కోల్డ్-చెయిన్ రవాణా వివరాలు\n• ముఖ్యమైన అత్యవసర నంబర్లు (112, 108, 100, 101)\n• DPDP చట్టం 2023 డేటా గోప్యత`;
    }
    if (currentLanguage === 'mr') {
      return `नमस्कार! मी लाइफलाइन AI आहे — तुमचा २४/७ आपत्कालीन आणि प्लॅटफॉर्म मार्गदर्शक.\n\nमी या प्लॅटफॉर्मबद्दल सर्व माहिती देऊ शकतो:\n• SOS आणि शांत बीकन कसे काम करते?\n• ICU व व्हेंटिलेटर खाटांचे आरक्षण कसे करावे?\n• रक्तपेढ्या व थेट कोल्ड-चेन रक्त साठा कुठे मिळेल?\n• राष्ट्रीय आपत्कालीन हेल्पलाइन क्रमांक (११२, १०८, १००, १०९१)\n• DPDP २०२३ डेटा सुरक्षा व गोपनीयता`;
    }
    return `Hello! I'm Lifeline AI — your 24/7 Emergency & Platform Assistant.\n\nI can answer anything about Lifeline India (PulseGrid):\n• How does the 2s/5s hold SOS & Silent Beacon work?\n• How to reserve ICU Ventilator beds across 10 hospitals?\n• How to match rare O- blood with IoT cold-chain tracking?\n• 24/7 verified national emergency helplines (112, 108, 100, 1091)\n• DPDP Act 2023 cryptographic privacy & data masking\n\nType or tap any prompt below!`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: getInitialWelcome(),
      timestamp: Date.now()
    }
  ]);

  // Update welcome message if language changes and only welcome is present
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome-msg') {
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'bot',
          text: getInitialWelcome(),
          timestamp: Date.now()
        }
      ]);
    }
  }, [currentLanguage]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  // Dynamic quick suggestions based on language
  // Dynamic quick suggestions based on language with native query text
  const quickChips = [
    {
      label: currentLanguage === 'hi' ? '🚨 SOS कैसे काम करता है?' :
             currentLanguage === 'te' ? '🚨 SOS ఎలా పనిచేస్తుంది?' :
             currentLanguage === 'mr' ? '🚨 SOS कसे काम करते?' : '🚨 How does SOS work?',
      query: currentLanguage === 'hi' ? 'लाइफलाइन SOS कैसे काम करता है और AI ट्रायज क्या करता है?' :
             currentLanguage === 'te' ? 'లైఫ్‌లైన్ SOS ఎలా పనిచేస్తుంది మరియు AI ట్రయాజ్ ఏంటి?' :
             currentLanguage === 'mr' ? 'लाइफलाइन SOS कसे कार्य करते आणि AI ट्रायज काय करतो?' : 'How does the Lifeline SOS trigger and triage work?'
    },
    {
      label: currentLanguage === 'hi' ? '🏥 ICU बेड कैसे बुक करें?' :
             currentLanguage === 'te' ? '🏥 ICU బెడ్ ఎలా బుక్ చేయాలి?' :
             currentLanguage === 'mr' ? '🏥 ICU खाट कशी बुक करावी?' : '🏥 How to book ICU Beds?',
      query: currentLanguage === 'hi' ? 'अस्पताल ICU वेंटिलेटर बेड आरक्षण और बाईपास पास कैसे काम करता है?' :
             currentLanguage === 'te' ? 'ఆసుపత్రి ICU వెంటిలేటర్ బెడ్ల రిజర్వేషన్ మరియు బైపాస్ పాస్ ఎలా పనిచేస్తుంది?' :
             currentLanguage === 'mr' ? 'रुग्णालय ICU व्हेंटिलेटर खाट आरक्षण आणि आपत्कालीन पास कसा मिळवावा?' : 'How does the ICU bed reservation and priority admission pass work?'
    },
    {
      label: currentLanguage === 'hi' ? '🩸 O- रक्त कहाँ मिलेगा?' :
             currentLanguage === 'te' ? '🩸 O- రక్తం ఎక్కడ లభిస్తుంది?' :
             currentLanguage === 'mr' ? '🩸 O- रक्त कुठे मिळेल?' : '🩸 Find O- Blood Banks',
      query: currentLanguage === 'hi' ? 'दुर्लभ O- रक्त समूह और कोल्ड-चेन रक्त बैंक कहाँ मिलेंगे?' :
             currentLanguage === 'te' ? 'అరుదైన O- రక్తం మరియు బ్లడ్ బ్యాంక్ నిల్వలు ఎక్కడ దొరుకుతాయి?' :
             currentLanguage === 'mr' ? 'O- दुर्मीळ रक्तगट आणि कोल्ड-चेन रक्तपेढ्या कुठे मिळतील?' : 'Where can I find O- blood and how does cold-chain tracking work?'
    },
    {
      label: currentLanguage === 'hi' ? '📞 राष्ट्रीय हेल्पलाइन नंबर' :
             currentLanguage === 'te' ? '📞 జాతీయ హెల్ప్‌లైన్ నంబర్లు' :
             currentLanguage === 'mr' ? '📞 राष्ट्रीय हेल्पलाइन क्रमांक' : '📞 National Helpline Numbers',
      query: currentLanguage === 'hi' ? 'भारत के आधिकारिक राष्ट्रीय आपातकालीन हेल्पलाइन नंबर क्या हैं?' :
             currentLanguage === 'te' ? 'భారతదేశంలోని ముఖ్యమైన జాతీయ అత్యవసర హెల్ప్‌లైన్ నంబర్లు ఏమిటి?' :
             currentLanguage === 'mr' ? 'भारतातील अधिकृत राष्ट्रीय आपत्कालीन हेल्पलाइन क्रमांक कोणते आहेत?' : 'What are the official national emergency helplines in India?'
    },
    {
      label: currentLanguage === 'hi' ? '👥 4 विशेष रोल क्या हैं?' :
             currentLanguage === 'te' ? '👥 4 ప్రత్యేక రోల్స్ ఏమిటి?' :
             currentLanguage === 'mr' ? '👥 ४ विशेष रोल कोणते आहेत?' : '👥 4 User Perspectives',
      query: currentLanguage === 'hi' ? 'लाइफलाइन के 4 विशेष रोल (नागरिक, रेस्पॉन्डर, एडमिन, प्राइवेसी) के बारे में बताएं' :
             currentLanguage === 'te' ? 'లైఫ్‌లైన్ లోని 4 పాత్రల (సిటిజన్, రెస్పాండర్, అడ్మిన్, గోప్యత) గురించి వివరించండి' :
             currentLanguage === 'mr' ? 'प्लॅटफॉर्मवरील ४ विशेष रोल (नागरिक, प्रतिसादक, ॲडमिन, गोपनीयता) स्पष्ट करा' : 'Tell me about the 4 specialized roles: Citizen, Responder, Admin, and Privacy'
    },
    {
      label: currentLanguage === 'hi' ? '🛡️ DPDP गोपनीयता व सुरक्षा' :
             currentLanguage === 'te' ? '🛡️ DPDP డేటా గోప్యత' :
             currentLanguage === 'mr' ? '🛡️ DPDP डेटा गोपनीयता' : '🛡️ DPDP Data Privacy',
      query: currentLanguage === 'hi' ? 'DPDP अधिनियम 2023 के तहत उपयोगकर्ता डेटा कैसे सुरक्षित रखा जाता है?' :
             currentLanguage === 'te' ? 'DPDP చట్టం 2023 ప్రకారం వినియోగదారు సమాచారం ఎలా భద్రపరచబడుతుంది?' :
             currentLanguage === 'mr' ? 'DPDP कायदा २०२३ अंतर्गत युझर डेटा कसा सुरक्षित ठेवला जातो?' : 'How is user data protected under the DPDP Act 2023?'
    }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    sound.playButtonTap();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: currentLanguage,
          history: messages.slice(-6).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            text: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      const replyText = data.reply || "I am here to guide you with any questions about Lifeline India.";

      // Check if reply references an action shortcut
      let action: ChatMessage['action'] = undefined;
      const lower = query.toLowerCase();
      if (lower.includes('marathi') || lower.includes('मराठी')) {
        action = { label: 'Switch to मराठी (Marathi)', actionType: 'lang_switch', value: 'mr' };
      } else if (lower.includes('hindi') || lower.includes('हिन्दी')) {
        action = { label: 'Switch to हिन्दी (Hindi)', actionType: 'lang_switch', value: 'hi' };
      } else if (lower.includes('telugu') || lower.includes('తెలుగు')) {
        action = { label: 'Switch to తెలుగు (Telugu)', actionType: 'lang_switch', value: 'te' };
      } else if (lower.includes('responder') || lower.includes('driver')) {
        action = { label: 'Open Responder Terminal', actionType: 'role_switch', value: 'responder' };
      } else if (lower.includes('admin') || lower.includes('command')) {
        action = { label: 'Open Admin Command Center', actionType: 'role_switch', value: 'admin' };
      } else if (lower.includes('privacy') || lower.includes('dpdp')) {
        action = { label: 'Open Privacy & Trust Center', actionType: 'role_switch', value: 'privacy' };
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: Date.now(),
        action
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.warn('Chat request failed, using intelligent client knowledge fallback:', err);
      const fallbackReply = getClientFallbackResponse(query, currentLanguage);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: fallbackReply,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side intelligent fallback response generator with full multilingual support
  const getClientFallbackResponse = (query: string, lang: string): string => {
    const q = query.toLowerCase();
    
    // ICU / Beds / Hospital
    if (q.includes('icu') || q.includes('bed') || q.includes('hospital') || q.includes('ఆసుపత్రి') || q.includes('బెడ్') || q.includes('अस्पताल') || q.includes('बेड') || q.includes('खाट')) {
      if (lang === 'te') {
        return `🏥 **ఆసుపత్రి బెడ్లు & ICU ట్రయాజ్:**\n\n• **10 ప్రముఖ ఆసుపత్రులు:** నిమ్స్, అపోలో జూబ్లీహిల్స్, కేర్ బంజారా, ఉస్మానియా మొదలైన వాటిలో రియల్-టైమ్ బెడ్ లభ్యత.\n• **బెడ్ రకాలు:** ICU వెంటిలేటర్, కార్డియాక్ కేర్, HDU మరియు అత్యవసర ట్రామా బే.\n• **ఎమర్జెన్సీ బైపాస్ టోకెన్:** బెడ్ బుక్ చేసిన వెంటనే ప్రాధాన్యత పాస్ లభిస్తుంది.`;
      }
      if (lang === 'hi') {
        return `🏥 **अस्पताल बेड एवं ICU ट्रायज प्रणाली:**\n\n• **10 सुपर-स्पेशियलिटी अस्पताल:** NIMS, अपोलो, केयर, उस्मानिया आदि में सीधे बेड रिज़र्व करें।\n• **बेड श्रेणियां:** ICU वेंटिलेटर, कार्डियक CICU, HDU और ट्रॉमा बे।\n• **बाईपास टोकन:** बुकिंग पर मरीज को आपातकालीन कक्ष में बिना कतार तुरंत प्रवेश मिलता है।`;
      }
      if (lang === 'mr') {
        return `🏥 **रुग्णालय खाट आरक्षण व ICU ट्रायज:**\n\n• **१० नामांकित रुग्णालये:** NIMS, अपोलो, केअर, उस्मानिया इत्यादींमध्ये थेट खाटांची उपलब्धता.\n• **खाटांचे प्रकार:** ICU व्हेंटिलेटर, कार्डिॲक CICU, HDU आणि ट्रॉमा बे.\n• **बायपास टोकन पास:** बुकिंग केल्यावर रुग्णाला तातडीचा प्रवेश पास मिळतो.`;
      }
      return `🏥 **Hospital Beds & ICU Triage Network:**\n\n• **Live Inventory across 10 Super-Specialties:** Real-time bed telemetry from NIMS Punjagutta, Apollo Jubilee Hills, Care Banjara, and Osmania General.\n• **Categorized Capacity:** Book ICU Ventilators, Cardiac CICU, High-Dependency Units (HDU), or Trauma Bays directly.\n• **Emergency Admission Bypass Pass:** Reservation generates a cryptographically signed Bypass Token with QR verification for zero-wait triage bypass upon arrival.`;
    }

    // SOS / Triggers
    if (q.includes('sos') || q.includes('trigger') || q.includes('hold') || q.includes('सायरन')) {
      if (lang === 'te') {
        return `🚨 **లైఫ్‌లైన్ SOS ఎలా పనిచేస్తుంది:**\n\n• **5-సెకన్ల హోల్డ్ (డెస్క్‌టాప్) / 2-సెకన్లు (మొబైల్):** పొరపాటు క్లిక్ కాకుండా బటన్‌ను నొక్కి ఉంచండి. వెంటనే వైబ్రేషన్ మరియు సైరన్ మోగుతుంది.\n• **సైలెంట్ SOS (ట్రిపుల్ ట్యాప్):** మహిళల రక్షణ కోసం రహస్యంగా SHE టీమ్స్ మరియు 108 వాహనాలకు సమాచారం వెళ్తుంది.\n• **ఖచ్చితమైన GPS లాకింగ్:** మీ పరికరం నుండి 5 మీటర్ల ఖచ్చితత్వంతో లొకేషన్ నమోదు అవుతుంది.\n• **Gemini AI ట్రయాజ్:** కృత్రిమ మేధస్సు వెంటనే ప్రథమ చికిత్స సూచనలు అందిస్తుంది.`;
      }
      if (lang === 'hi') {
        return `🚨 **लाइफलाइन SOS कैसे काम करता है:**\n\n• **5-सेकंड कंसोल होल्ड (डेस्कटॉप) / 2-सेकंड होल्ड (मोबाइल):** आकस्मिक क्लिक रोकने के लिए SOS बटन को दबाए रखें। तुरंत हैप्टिक कंपन और सायरन चालू होता है।\n• **साइलेंट SOS (ट्रिपल टैप):** महिलाओं या गुप्त खतरे के समय बिना सायरन के निकटवर्ती शी टीम्स और 112 को गुप्त बीकन भेजता है।\n• **सटीक GPS लॉकिंग:** ब्राउज़र के उच्च-सटीक GPS से 5-मीटर के दायरे में आपकी लोकेशन लॉक होती है।`;
      }
      if (lang === 'mr') {
        return `🚨 **लाइफलाइन SOS कसे कार्य करते:**\n\n• **५-सेकंद दाबून ठेवा (डेस्कटॉप) / २-सेकंद (मोबाईल):** चुकीचा स्पर्श टाळण्यासाठी SOS बटण दाबून ठेवा. तात्काळ सायरन आणि व्हायब्रेशन सुरू होते.\n• **शांत SOS (ट्रिपल टॅप):** महिला सुरक्षिततेसाठी थेट निर्भया पथक व ११२ कडे गुप्त इशारा पोहोचतो.\n• **अचूक GPS स्थान निश्चिती:** ५ मीटरच्या अचूकतेसह तुमचे थेट स्थान लॉक केले जाते.`;
      }
      return `🚨 **How the Lifeline SOS Engine Operates:**\n\n• **5-Second Hold (Desktop) / 2-Second Hold (Mobile):** Eliminates false alarms with high-fidelity Web Audio countdown ticks and Web Vibration haptic feedback.\n• **Silent SOS (Triple Tap):** Discreet beacon designed for women safety or covert threats; intercepts directly with Telangana Police SHE Teams.\n• **Sub-Second Gemini AI Triage:** Classifies trauma severity and dispatches localized step-by-step first-aid guidance.`;
    }

    // Blood banks
    if (q.includes('blood') || q.includes('donor') || q.includes('रक्त') || q.includes('రక్తం')) {
      if (lang === 'te') {
        return `🩸 **రక్త నిల్వలు & కోల్డ్-చెయిన్ విధానం:**\n\n• **అరుదైన రక్త సమూహాలు:** O-, AB-, B+ రక్తం కోసం 8 సర్టిఫైడ్ బ్లడ్ బ్యాంకుల్లో లైవ్ స్టాక్ చూడవచ్చు.\n• **కోల్డ్-చెయిన్ రక్షణ:** రవాణా సమయంలో ఉష్ణోగ్రత (2°C - 6°C) నిరంతరం పరిశీలించబడుతుంది.\n• **తక్షణ రిజర్వేషన్:** శస్త్రచికిత్స కోసం నేరుగా ఆసుపత్రికి రక్తాన్ని ఆర్డర్ చేయవచ్చు.`;
      }
      if (lang === 'hi') {
        return `🩸 **राष्ट्रीय रक्त आवंटन एवं कोल्ड-चेन लॉजिस्टिक्स:**\n\n• **दुर्लभ रक्त समूह ट्रैकिंग:** O-, AB-, A-, B+ समूहों के लिए 8 प्रमाणित ब्लड बैंकों में वास्तविक स्टॉक की जांच करें।\n• **कोल्ड-चेन सुरक्षा:** रक्त परिवहन के दौरान तापमान (2°C - 6°C) सेंसर द्वारा सीधे मॉनिटर किया जाता है।`;
      }
      if (lang === 'mr') {
        return `🩸 **राष्ट्रीय रक्त वाटप आणि कोल्ड-चेन लॉजिस्टिक्स:**\n\n• **दुर्मीळ रक्तगट ट्रॅकिंग:** O-, AB-, A-, B+ यांसारख्या रक्तगटांसाठी ८ प्रमाणित रक्तपेढ्यांमध्ये थेट साठा तपासा.\n• **कोल्ड-चेन सुरक्षितता:** वाहतुकीदरम्यान तापमान २°C ते ६°C नियंत्रित ठेवले जाते.`;
      }
      return `🩸 **National Blood Matcher & Cold-Chain Logistics:**\n\n• **Real-Time Depots:** Monitored across 8 certified blood banks (Red Cross, Osmania, Chiranjeevi, NIMS) with instant filtering by blood group (e.g. critical O- negative).\n• **IoT Cold-Chain Telemetry:** Active temperature logging (maintained strictly between 2°C – 6°C) with tamper-proof digital lock telemetry.`;
    }

    // Helplines
    if (q.includes('helpline') || q.includes('number') || q.includes('112') || q.includes('108') || q.includes('నంబర్లు') || q.includes('क्रमांक')) {
      if (lang === 'te') {
        return `📞 **ముఖ్యమైన జాతీయ అత్యవసర నంబర్లు:**\n\n• **112:** అన్నీ కలిపిన జాతీయ అత్యవసర నంబర్ (పోలీస్, ఫైర్, అంబులెన్స్)\n• **108:** వైద్య ఎమర్జెన్సీ అంబులెన్స్\n• **100:** పోలీస్ కంట్రోల్ రూమ్\n• **101:** ఫైర్ & రెస్క్యూ సర్వీసెస్\n• **1091 / 181:** మహిళా రక్షణ / SHE టీమ్స్\n• **1098:** చైల్డ్‌లైన్ హెల్ప్‌లైన్\n• **1930:** సైబర్ క్రైమ్ హెల్ప్‌లైన్`;
      }
      if (lang === 'hi') {
        return `📞 **भारत के प्रमुख राष्ट्रीय आपातकालीन हेल्पलाइन नंबर:**\n\n• **112:** एकीकृत राष्ट्रीय आपातकाल (पुलिस, अग्निशामक, एम्बुलेंस)\n• **108:** आपातकालीन चिकित्सा एम्बुलेंस (ALS/BLS)\n• **100:** पुलिस नियंत्रण कक्ष\n• **101:** अग्निशामक एवं बचाव\n• **1091 / 181:** महिला सुरक्षा / शी टीम्स\n• **1098:** चाइल्डलाइन आपातकाल\n• **1930:** साइबर अपराध हेल्पलाइन`;
      }
      if (lang === 'mr') {
        return `📞 **भारतातील प्रमुख आपत्कालीन हेल्पलाइन क्रमांक:**\n\n• **११२:** एकीकृत राष्ट्रीय आपत्कालीन सेवा (पोलीस, अग्निशामक, रुग्णवाहिका)\n• **१०८:** वैद्यकीय आपत्कालीन रुग्णवाहिका\n• **१००:** पोलीस नियंत्रण कक्ष\n• **१०१:** अग्निशामक व बचाव दल\n• **१०९१ / १८१:** महिला सुरक्षा व निर्भया पथक\n• **१०९८:** बाल संरक्षण हेल्पलाइन\n• **१९३०:** सायबर गुन्हे हेल्पलाइन`;
      }
      return `📞 **National Emergency Helplines (24/7 Toll-Free):**\n\n• **112:** Unified Emergency (Police, Fire, Medical)\n• **108:** Emergency Ambulance (ALS/BLS)\n• **100:** Police Control Room\n• **101:** Fire & Rescue\n• **1091 / 181:** Women Safety / SHE Teams\n• **1098:** Childline Emergency\n• **1930:** Cyber Crime Reporting`;
    }

    if (lang === 'te') {
      return `👋 **లైఫ్‌లైన్ AI అసిస్టెంట్:**\n\nనేను ప్లాట్‌ఫారమ్ గురించిన వివరాలను మీకు అందించగలను. మీరు అత్యవసర SOS, ఆసుపత్రి ICU బెడ్లు, రక్త నిల్వలు, లేదా జాతీయ హెల్ప్‌లైన్ల గురించి నన్ను అడగవచ్చు.`;
    }
    if (lang === 'hi') {
      return `👋 **लाइफलाइन AI सहायक:**\n\nमैं प्लेटफ़ॉर्म की सभी सुविधाओं में आपका मार्गदर्शन कर सकता हूँ। आप मुझसे आपातकालीन SOS, ICU अस्पताल बेड, रक्त बैंक या राष्ट्रीय हेल्पलाइन के बारे में पूछ सकते हैं।`;
    }
    if (lang === 'mr') {
      return `👋 **लाइफलाइन AI मार्गदर्शक:**\n\nमी आपणास आपत्कालीन SOS, ICU रुग्णालय खाटा, रक्तपेढ्या आणि राष्ट्रीय हेल्पलाइनविषयी संपूर्ण माहिती देऊ शकतो.`;
    }
    return `👋 **Lifeline India Assistant:**\n\nI am your intelligent guide across all platform features. You can ask me about emergency dispatch, hospital ICU beds, blood matching, privacy, and our 4 supported languages (English, Hindi, Telugu, and Marathi).`;
  };

  // Speech Recognition (Multilingual Voice Input)
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    try {
      const recognition = new SpeechRec();
      const langMap: Record<string, string> = {
        hi: 'hi-IN',
        te: 'te-IN',
        mr: 'mr-IN',
        en: 'en-IN'
      };
      recognition.lang = langMap[currentLanguage] || 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        sound.playCountdownTick(800);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleActionClick = (action: NonNullable<ChatMessage['action']>) => {
    if (action.actionType === 'lang_switch') {
      setLanguage(action.value as any);
      sound.playSuccessChime();
    } else if (action.actionType === 'role_switch') {
      setActiveRole(action.value as any);
      sound.playSuccessChime();
    }
  };

  const handleLanguageSwitch = (newLang: Language) => {
    sound.playButtonTap();
    setLanguage(newLang);

    // Provide instant bot confirmation in the chat window
    const switchGreetings: Record<Language, string> = {
      te: `🌐 భాష **తెలుగు**గా మార్చబడింది. ప్లాట్‌ఫారమ్ లేదా అత్యవసర సేవల గురించి ఏ ప్రశ్నైనా అడగవచ్చు!`,
      hi: `🌐 भाषा सफलतापूर्वक **हिन्दी** में बदल दी गई है। आप कोई भी आपातकालीन या प्लेटफ़ॉर्म प्रश्न पूछ सकते हैं!`,
      mr: `🌐 भाषा **मराठी** मध्ये बदलली आहे. आपण आपत्कालीन सेवा किंवा प्लॅटफॉर्मविषयी कोणताही प्रश्न विचारू शकता!`,
      en: `🌐 Language switched to **English**. Ask any question about the platform or emergency services!`
    };

    setMessages(prev => [
      ...prev,
      {
        id: `lang-switch-${Date.now()}`,
        sender: 'bot',
        text: switchGreetings[newLang] || switchGreetings.en,
        timestamp: Date.now()
      }
    ]);
  };

  const handleClearHistory = () => {
    sound.playButtonTap();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: getInitialWelcome(),
        timestamp: Date.now()
      }
    ]);
  };

  // Helper to render clean formatted text with simple, legible typography (NO raw * or ** asterisks!)
  const renderCleanMessageContent = (text: string) => {
    const lines = text.split('\n');

    return (
      <div className="space-y-1.5 text-slate-200 font-sans text-xs leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          // Detect bullet points
          const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('* ');
          const cleanLine = isBullet
            ? trimmed.replace(/^([•\-\*]\s*)/, '')
            : trimmed;

          // Parse bold tags **word** or *word* and strip raw asterisks
          const parts = cleanLine.split(/(\*\*.*?\*\*|\*.*?\*)/g);

          const renderedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
              const inner = part.slice(2, -2).trim();
              return <strong key={pIdx} className="font-bold text-white tracking-tight">{inner}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
              const inner = part.slice(1, -1).trim();
              return <strong key={pIdx} className="font-semibold text-slate-100">{inner}</strong>;
            }
            // Remove any stray lone asterisks
            const cleanPart = part.replace(/\*/g, '');
            return <span key={pIdx}>{cleanPart}</span>;
          });

          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5 shadow-xs" />
                <div className="flex-1 leading-snug">{renderedLine}</div>
              </div>
            );
          }

          return (
            <div key={idx} className="leading-snug">
              {renderedLine}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            sound.playButtonTap();
            setIsOpen(true);
          }}
          className="fixed bottom-6 right-6 z-[9990] group flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-bold text-xs shadow-2xl shadow-red-600/40 border border-red-400/40 hover:scale-105 active:scale-95 transition-all duration-200"
          title="Ask Lifeline AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
          </div>
          <span className="tracking-wide uppercase font-mono font-extrabold hidden sm:inline">
            Lifeline AI
          </span>
          {hasUnread && (
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
          )}
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-[9999] w-[92vw] sm:w-[430px] h-[600px] max-h-[85vh] bg-[#090d16]/95 backdrop-blur-2xl border border-slate-800/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0c1220]/90 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-red-600/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white tracking-wide">
                    Lifeline AI
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Hyderabad Emergency Grid Assistant
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Clear Chat History"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-xl transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  sound.playButtonTap();
                  setIsOpen(false);
                }}
                title="Close Chat"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* In-Chat Language Selector Bar - Directly change website & chatbot language */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-[#0b101d] border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] font-bold">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {currentLanguage === 'hi' ? 'भाषा चुनें:' :
                 currentLanguage === 'te' ? 'భాషను ఎంచుకోండి:' :
                 currentLanguage === 'mr' ? 'भाषा निवडा:' :
                 'SELECT LANGUAGE:'}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {([
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिन्दी' },
                { code: 'te', label: 'తెలుగు' },
                { code: 'mr', label: 'मराठी' }
              ] as const).map(l => (
                <button
                  key={l.code}
                  onClick={() => handleLanguageSwitch(l.code as Language)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                    currentLanguage === l.code
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Suggestions Horizontal Scroll Strip */}
          <div className="px-3 py-2 bg-[#080c14] border-b border-slate-850 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0 ml-1" />
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.query)}
                className="shrink-0 px-2.5 py-1 rounded-xl bg-slate-900/90 hover:bg-red-950/60 border border-slate-800 hover:border-red-500/40 text-[10px] font-semibold text-slate-300 hover:text-red-300 transition whitespace-nowrap active:scale-95"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs selection:bg-red-500 selection:text-white">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-br-xs font-medium'
                      : 'bg-slate-900/90 border border-slate-800/80 text-slate-200 rounded-bl-xs'
                  }`}
                >
                  {/* Clean text formatting with simple fonts and zero raw asterisks */}
                  {msg.sender === 'user' ? (
                    <div className="text-xs text-white leading-normal font-sans">
                      {msg.text}
                    </div>
                  ) : (
                    renderCleanMessageContent(msg.text)
                  )}

                  {/* Interactive Action Shortcut */}
                  {msg.action && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => handleActionClick(msg.action!)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 text-slate-950 font-black text-[11px] hover:brightness-110 active:scale-95 transition shadow-sm"
                      >
                        <span>{msg.action.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-slate-500 font-mono mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {/* Premium Typing / Thinking Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                {/* Bot avatar */}
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shrink-0 shadow-md shadow-red-600/30">
                  <svg width="14" height="10" viewBox="0 0 34 24" fill="none">
                    <polyline points="0,12 6,12 9,4 12,20 15,1 18,23 21,12 34,12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1.5 bg-slate-900/90 border border-slate-800/80 rounded-2xl rounded-bl-sm px-3.5 py-3 min-w-[140px]">
                  {/* ECG line */}
                  <svg width="110" height="20" viewBox="0 0 110 20" fill="none" className="overflow-visible">
                    <polyline
                      points="0,10 18,10 22,3 26,17 30,0 34,19 38,10 110,10"
                      stroke="#f87171"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="140"
                      strokeDashoffset="140"
                      style={{ animation: 'ecg-chat 1.6s ease-in-out infinite' }}
                    />
                    <style>{`
                      @keyframes ecg-chat {
                        0%   { stroke-dashoffset: 140; opacity:1; }
                        55%  { stroke-dashoffset: 0;   opacity:1; }
                        80%  { stroke-dashoffset: 0;   opacity:0.6; }
                        100% { stroke-dashoffset: 140; opacity:0; }
                      }
                    `}</style>
                  </svg>
                  {/* Dot row + label */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[0,1,2].map(i => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{
                            animationDelay: `${i * 0.18}s`,
                            background: ['#f87171','#fb7185','#fbbf24'][i]
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 tracking-wide">AI thinking…</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 bg-[#0a0e18] border-t border-slate-800">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={
                    currentLanguage === 'hi' ? 'सवाल पूछें (उदा. ICU बेड, SOS, हेल्पलाइन)...' :
                    currentLanguage === 'te' ? 'ప్రశ్న అడగండి (ఉదా: ICU బెడ్లు, SOS)...' :
                    currentLanguage === 'mr' ? 'प्रश्न विचारा (उदा. ICU खाट, SOS, हेल्पलाइन)...' :
                    'Ask anything (e.g. SOS, ICU beds, O- blood)...'
                  }
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-red-500 rounded-2xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                />

                {/* Speech Dictation Button */}
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  title={isListening ? 'Stop Listening' : 'Speak your question'}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-9 h-9 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 disabled:hover:from-red-600 text-white flex items-center justify-center transition active:scale-95 shadow-md shadow-red-600/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
              <span>Lifeline AI Model: Gemini 3.8 & Knowledge Grid</span>
              <span className="font-mono text-emerald-400">100% DPDP Verified</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

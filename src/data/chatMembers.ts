export interface ChatContact {
  id: string;
  name: string;
  businessName: string;
  role: 'BUYER' | 'TRADER' | 'APMC_AGENT' | 'EXPERT' | 'TRANSPORTER' | 'FARMER';
  roleBadge: string;
  location: string;
  avatarText: string;
  avatarBg: string;
  isVerified: boolean;
  online: boolean;
  lastActive: string;
  phone: string;
  dealId?: string;
  dealCode?: string;
  dealCrop?: string;
  dealQty?: number;
  dealPrice?: number;
  dealStatus?: string;
  cropTags: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface ChatMessageItem {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderRole: 'FARMER' | 'BUYER' | 'TRADER' | 'APMC_AGENT' | 'EXPERT' | 'TRANSPORTER' | 'SYSTEM';
  text: string;
  time: string;
  timestamp: number;
  type: 'TEXT' | 'SYSTEM' | 'VOICE_NOTE' | 'IMAGE' | 'CALL_LOG';
  voiceDuration?: string;
  isMe: boolean;
}

export const INITIAL_CHAT_MEMBERS: ChatContact[] = [
  {
    id: 'user-buyer-1',
    name: 'Vikram Reddy',
    businessName: 'Sri Balaji Agro Fresh Pvt Ltd',
    role: 'BUYER',
    roleBadge: 'Wholesale Buyer · Hyderabad Mandi',
    location: 'Bowenpally Terminal, Hyderabad (520 km)',
    avatarText: 'VR',
    avatarBg: 'bg-emerald-700',
    isVerified: true,
    online: true,
    lastActive: 'Active now',
    phone: '+91 94401 67890',
    dealId: 'deal-88210',
    dealCode: '#AGRI-88210',
    dealCrop: 'Tomato (Grade A)',
    dealQty: 400,
    dealPrice: 26,
    dealStatus: 'Advance Secured · Pre-Booked',
    cropTags: ['Tomato', 'Onion'],
    lastMessage: 'Truck has left Bowenpally. Driver Shiva will arrive Kalikiri around 4:00 PM.',
    lastMessageTime: '2m ago',
    unreadCount: 1
  },
  {
    id: 'user-buyer-2',
    name: 'Anand Kumar',
    businessName: 'Southern Fresh Procurement Hub',
    role: 'BUYER',
    roleBadge: 'Supermarket Aggregator · Bengaluru',
    location: 'Yeshwanthpur Yard-B, Bengaluru (165 km)',
    avatarText: 'AK',
    avatarBg: 'bg-amber-700',
    isVerified: true,
    online: true,
    lastActive: 'Active now',
    phone: '+91 98860 54321',
    cropTags: ['Tomato', 'Green Chilli'],
    lastMessage: 'We received your 300 kg Tomato Grade A offer. Rate of ₹28/kg is approved.',
    lastMessageTime: '18m ago',
    unreadCount: 2
  },
  {
    id: 'expert-swaminathan',
    name: 'Dr. M. S. Swaminathan Jr.',
    businessName: 'Krishi Vigyan Agricultural Desk',
    role: 'EXPERT',
    roleBadge: 'Agri Agronomist & Crop Doctor',
    location: 'KVK Tirupati Research Station',
    avatarText: 'DR',
    avatarBg: 'bg-teal-700',
    isVerified: true,
    online: true,
    lastActive: 'Active now',
    phone: '+91 87722 45678',
    cropTags: ['Tomato', 'Chilli', 'Mango', 'Paddy'],
    lastMessage: 'For Grade A tomatoes, harvest in morning before 10 AM to prevent thermal loss.',
    lastMessageTime: '45m ago',
    unreadCount: 0
  },
  {
    id: 'trader-azadpur-delhi',
    name: 'Rajesh Sharma',
    businessName: 'Azadpur North India Commission Agent',
    role: 'APMC_AGENT',
    roleBadge: 'APMC Azadpur Mandi · Delhi',
    location: 'Azadpur Fruits & Veg Mandi, Delhi (2,150 km)',
    avatarText: 'RS',
    avatarBg: 'bg-blue-700',
    isVerified: true,
    online: false,
    lastActive: '12m ago',
    phone: '+91 98110 33445',
    cropTags: ['Tomato', 'Onion', 'Potato'],
    lastMessage: 'Today wholesale rate in Delhi opened at ₹34/kg. High demand for firm red lots.',
    lastMessageTime: '1h ago',
    unreadCount: 0
  },
  {
    id: 'user-buyer-3',
    name: 'Kishore Naidu',
    businessName: 'Rayalaseema Traders & Exports',
    role: 'BUYER',
    roleBadge: 'Export Procurement · Tirupati',
    location: 'Renigunta Mandi Road, Tirupati (42 km)',
    avatarText: 'KN',
    avatarBg: 'bg-stone-700',
    isVerified: true,
    online: true,
    lastActive: 'Active now',
    phone: '+91 94900 11223',
    cropTags: ['Green Chilli', 'Mango', 'Tomato'],
    lastMessage: 'Can pick up directly from Kalikiri farmgate if you have 1,000 kg Grade A Teja chilli.',
    lastMessageTime: '2h ago',
    unreadCount: 0
  },
  {
    id: 'logistics-balaji',
    name: 'Balaji Agri Logistics & Reefer',
    businessName: 'Kisan Cold Chain Transport Co.',
    role: 'TRANSPORTER',
    roleBadge: 'Certified Agri Logistics Fleet',
    location: 'Chittoor - Bengaluru Highway Corridor',
    avatarText: 'BL',
    avatarBg: 'bg-orange-700',
    isVerified: true,
    online: true,
    lastActive: 'Active now',
    phone: '+91 90001 88776',
    cropTags: ['Transport', 'Reefer Truck', 'Crates'],
    lastMessage: '4-ton insulated truck available at Kalikiri junction. Freight ₹2.20/kg to Bengaluru.',
    lastMessageTime: '3h ago',
    unreadCount: 0
  },
  {
    id: 'user-buyer-4',
    name: 'Venkat Rao',
    businessName: 'Chittoor APMC Market Commission Desk',
    role: 'APMC_AGENT',
    roleBadge: 'Local APMC Yard Inspector',
    location: 'Chittoor Town Mandi Yard (18 km)',
    avatarText: 'VR',
    avatarBg: 'bg-indigo-700',
    isVerified: false,
    online: false,
    lastActive: '35m ago',
    phone: '+91 98492 55667',
    cropTags: ['Tomato', 'Groundnut', 'Mango'],
    lastMessage: 'Evening auction starts 4:30 PM. Weighbridge receipt issued immediately.',
    lastMessageTime: '4h ago',
    unreadCount: 0
  },
  {
    id: 'user-buyer-5',
    name: 'Sanjay Patil',
    businessName: 'Maharashtra Mega Food Supply',
    role: 'BUYER',
    roleBadge: 'Food Processor · Vashi Navi Mumbai',
    location: 'Turbhe APMC Yard, Mumbai (980 km)',
    avatarText: 'SP',
    avatarBg: 'bg-amber-800',
    isVerified: true,
    online: true,
    lastActive: 'Active now',
    phone: '+91 98200 44556',
    cropTags: ['Tomato', 'Onion', 'Garlic'],
    lastMessage: 'We offer full container subsidy for lots above 5 metric tons.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0
  },
  {
    id: 'farmer-suresh',
    name: 'Suresh Patel',
    businessName: 'Lasalgaon Onion & Veg Growers Union',
    role: 'FARMER',
    roleBadge: 'Fellow Farmer & Union Representative',
    location: 'Nashik District, Maharashtra',
    avatarText: 'SP',
    avatarBg: 'bg-emerald-800',
    isVerified: true,
    online: false,
    lastActive: '2h ago',
    phone: '+91 94220 77889',
    cropTags: ['Onion', 'Wheat', 'Maize'],
    lastMessage: 'Bhai, check Lasalgaon prices. Double cured Garwa onions are fetching great rates.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0
  },
  {
    id: 'tradebridge-advisory',
    name: 'TradeBridge Market Advisory Desk',
    businessName: 'Official APMC Price & Weather Intelligence',
    role: 'EXPERT',
    roleBadge: 'Real-Time Agricultural Intelligence',
    location: 'All-India APMC Integration Core',
    avatarText: 'TB',
    avatarBg: 'bg-[#1E7C48]',
    isVerified: true,
    online: true,
    lastActive: 'Always online',
    phone: 'Toll-free 1800-TB-AGRI',
    cropTags: ['Market Prices', 'Weather', 'Govt MSP', 'Advisory'],
    lastMessage: 'Tomato prices projected steady in South mandis. Madanapalle daily arrivals: 420 Tons.',
    lastMessageTime: '2 days ago',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES_MAP: Record<string, ChatMessageItem[]> = {
  'user-buyer-1': [
    {
      id: 'm-deal-init',
      chatId: 'user-buyer-1',
      senderId: 'system',
      senderName: 'TradeBridge System',
      senderRole: 'SYSTEM',
      text: 'Deal #AGRI-88210 pre-booked! 400 kg Tomato Grade A locked at ₹26/kg.',
      time: '11:00 AM',
      timestamp: Date.now() - 1000 * 60 * 120,
      type: 'SYSTEM',
      isMe: false
    },
    {
      id: 'm-1-1',
      chatId: 'user-buyer-1',
      senderId: 'user-buyer-1',
      senderName: 'Vikram Reddy',
      senderRole: 'BUYER',
      text: 'Namaste Ramesh garu. We have dispatched our transport truck. Will reach Kalikiri by 4:00 PM.',
      time: '11:15 AM',
      timestamp: Date.now() - 1000 * 60 * 80,
      type: 'TEXT',
      isMe: false
    },
    {
      id: 'm-1-2',
      chatId: 'user-buyer-1',
      senderId: 'user-farmer-1',
      senderName: 'Ramesh Naidu',
      senderRole: 'FARMER',
      text: 'Namaste sir. 400 kg tomatoes are harvest-crated and ready at the farm gate.',
      time: '11:30 AM',
      timestamp: Date.now() - 1000 * 60 * 60,
      type: 'TEXT',
      isMe: true
    },
    {
      id: 'm-1-3',
      chatId: 'user-buyer-1',
      senderId: 'user-buyer-1',
      senderName: 'Vikram Reddy',
      senderRole: 'BUYER',
      text: 'Truck has left Bowenpally. Driver Shiva will arrive Kalikiri around 4:00 PM.',
      time: '12:02 PM',
      timestamp: Date.now() - 1000 * 60 * 2,
      type: 'TEXT',
      isMe: false
    }
  ],
  'user-buyer-2': [
    {
      id: 'm-2-1',
      chatId: 'user-buyer-2',
      senderId: 'user-farmer-1',
      senderName: 'Ramesh Naidu',
      senderRole: 'FARMER',
      text: 'Namaste Anand ji. Sent a sell request for 300 kg Tomato Grade A from Kalikiri.',
      time: '10:45 AM',
      timestamp: Date.now() - 1000 * 60 * 40,
      type: 'TEXT',
      isMe: true
    },
    {
      id: 'm-2-2',
      chatId: 'user-buyer-2',
      senderId: 'user-buyer-2',
      senderName: 'Anand Kumar',
      senderRole: 'BUYER',
      text: 'We received your 300 kg Tomato Grade A offer. Rate of ₹28/kg is approved.',
      time: '11:05 AM',
      timestamp: Date.now() - 1000 * 60 * 18,
      type: 'TEXT',
      isMe: false
    },
    {
      id: 'm-2-3',
      chatId: 'user-buyer-2',
      senderId: 'user-buyer-2',
      senderName: 'Anand Kumar',
      senderRole: 'BUYER',
      text: 'Please keep produce in plastic crates. Our Bengaluru vehicle is en route.',
      time: '11:06 AM',
      timestamp: Date.now() - 1000 * 60 * 17,
      type: 'TEXT',
      isMe: false
    }
  ],
  'expert-swaminathan': [
    {
      id: 'm-3-1',
      chatId: 'expert-swaminathan',
      senderId: 'expert-swaminathan',
      senderName: 'Dr. M. S. Swaminathan Jr.',
      senderRole: 'EXPERT',
      text: 'Namaste Kisan brother. Welcome to Krishi Agronomy advisory. How can I help with your harvest quality today?',
      time: '9:30 AM',
      timestamp: Date.now() - 1000 * 60 * 90,
      type: 'TEXT',
      isMe: false
    },
    {
      id: 'm-3-2',
      chatId: 'expert-swaminathan',
      senderId: 'user-farmer-1',
      senderName: 'Ramesh Naidu',
      senderRole: 'FARMER',
      text: 'Sir, how to ensure my tomatoes maintain Grade A export firmness during transit?',
      time: '10:00 AM',
      timestamp: Date.now() - 1000 * 60 * 60,
      type: 'TEXT',
      isMe: true
    },
    {
      id: 'm-3-3',
      chatId: 'expert-swaminathan',
      senderId: 'expert-swaminathan',
      senderName: 'Dr. M. S. Swaminathan Jr.',
      senderRole: 'EXPERT',
      text: 'For Grade A tomatoes, harvest in morning before 10 AM to prevent thermal loss. Keep fruit stalks intact and store in ventilated plastic crates away from direct sun.',
      time: '10:15 AM',
      timestamp: Date.now() - 1000 * 60 * 45,
      type: 'TEXT',
      isMe: false
    }
  ],
  'trader-azadpur-delhi': [
    {
      id: 'm-4-1',
      chatId: 'trader-azadpur-delhi',
      senderId: 'trader-azadpur-delhi',
      senderName: 'Rajesh Sharma',
      senderRole: 'APMC_AGENT',
      text: 'Today wholesale rate in Delhi opened at ₹34/kg. High demand for firm red lots.',
      time: '10:50 AM',
      timestamp: Date.now() - 1000 * 60 * 60,
      type: 'TEXT',
      isMe: false
    }
  ],
  'user-buyer-3': [
    {
      id: 'm-5-1',
      chatId: 'user-buyer-3',
      senderId: 'user-buyer-3',
      senderName: 'Kishore Naidu',
      senderRole: 'BUYER',
      text: 'Can pick up directly from Kalikiri farmgate if you have 1,000 kg Grade A Teja chilli.',
      time: '9:15 AM',
      timestamp: Date.now() - 1000 * 60 * 120,
      type: 'TEXT',
      isMe: false
    }
  ],
  'logistics-balaji': [
    {
      id: 'm-6-1',
      chatId: 'logistics-balaji',
      senderId: 'logistics-balaji',
      senderName: 'Balaji Agri Logistics',
      senderRole: 'TRANSPORTER',
      text: '4-ton insulated truck available at Kalikiri junction. Freight ₹2.20/kg to Bengaluru.',
      time: '8:45 AM',
      timestamp: Date.now() - 1000 * 60 * 180,
      type: 'TEXT',
      isMe: false
    }
  ],
  'user-buyer-4': [
    {
      id: 'm-7-1',
      chatId: 'user-buyer-4',
      senderId: 'user-buyer-4',
      senderName: 'Venkat Rao',
      senderRole: 'APMC_AGENT',
      text: 'Evening auction starts 4:30 PM. Weighbridge receipt issued immediately.',
      time: '8:00 AM',
      timestamp: Date.now() - 1000 * 60 * 240,
      type: 'TEXT',
      isMe: false
    }
  ],
  'user-buyer-5': [
    {
      id: 'm-8-1',
      chatId: 'user-buyer-5',
      senderId: 'user-buyer-5',
      senderName: 'Sanjay Patil',
      senderRole: 'BUYER',
      text: 'We offer full container subsidy for lots above 5 metric tons.',
      time: 'Yesterday',
      timestamp: Date.now() - 1000 * 60 * 1440,
      type: 'TEXT',
      isMe: false
    }
  ],
  'farmer-suresh': [
    {
      id: 'm-9-1',
      chatId: 'farmer-suresh',
      senderId: 'farmer-suresh',
      senderName: 'Suresh Patel',
      senderRole: 'FARMER',
      text: 'Bhai, check Lasalgaon prices. Double cured Garwa onions are fetching great rates.',
      time: 'Yesterday',
      timestamp: Date.now() - 1000 * 60 * 1440,
      type: 'TEXT',
      isMe: false
    }
  ],
  'tradebridge-advisory': [
    {
      id: 'm-10-1',
      chatId: 'tradebridge-advisory',
      senderId: 'tradebridge-advisory',
      senderName: 'TradeBridge Advisory',
      senderRole: 'SYSTEM',
      text: 'Tomato prices projected steady in South mandis. Madanapalle daily arrivals: 420 Tons. Best spot realizations across Madanapalle & Bengaluru.',
      time: '2 days ago',
      timestamp: Date.now() - 1000 * 60 * 2880,
      type: 'TEXT',
      isMe: false
    }
  ]
};

export const QUICK_REPLY_PROMPTS: Record<string, string[]> = {
  BUYER: [
    'What is your final offered price per kg?',
    'Produce is harvest-crated and ready at farmgate.',
    'When will your pickup vehicle arrive?',
    'Can you share the weighbridge slip?',
    'Grade A quality verified by video inspection.'
  ],
  APMC_AGENT: [
    'What is the modal auction rate today?',
    'How many tons arrived in mandi this morning?',
    'I have 50 crates ready. Can I dispatch today?',
    'What are the commission and labor charges?'
  ],
  EXPERT: [
    'How do I maintain Grade A firmness in transit?',
    'What fertilizer or treatment is best for pest prevention?',
    'How is brix sweetness tested on farm?',
    'What are the export quality criteria?'
  ],
  TRANSPORTER: [
    'Can you pick up from Kalikiri farmgate?',
    'What is your per kg freight rate to Bengaluru / Chennai?',
    'Do you provide ventilated plastic crates?',
    'Please share driver phone number.'
  ],
  FARMER: [
    'How is the mandi auction rate in your area?',
    'Are buyers accepting harvest in gunny bags or crates?',
    'Is transport sharing available from Kalikiri?',
    'Let us coordinate combined truckload for better rate.'
  ]
};

export function getAutoReply(member: ChatContact, userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  if (member.role === 'BUYER') {
    if (msg.includes('price') || msg.includes('rate') || msg.includes('₹')) {
      return `For Grade A ${member.cropTags[0] || 'crop'}, our confirmed rate is ₹${member.dealPrice || 28}/kg. Direct electronic settlement upon weighbridge receipt.`;
    }
    if (msg.includes('ready') || msg.includes('crate') || msg.includes('harvest')) {
      return `Excellent. Please keep the lots labeled. Our driver Shiva will inspect and load without delay.`;
    }
    if (msg.includes('when') || msg.includes('arrive') || msg.includes('time') || msg.includes('truck')) {
      return `Vehicle is en route on national highway. ETA is approximately 45-60 minutes at your farmgate.`;
    }
    if (msg.includes('deal') || msg.includes('confirm') || msg.includes('booked')) {
      return `Deal is safely pre-booked on TradeBridge with advance locked. Looking forward to long-term direct trade.`;
    }
    return `Understood Ramesh garu. Our team at ${member.businessName} has noted this. Will update you shortly!`;
  }

  if (member.role === 'EXPERT') {
    if (msg.includes('firm') || msg.includes('grade') || msg.includes('quality')) {
      return `For top grading: Sort out sunburn or damaged skin immediately. Store produce in 20-25°C shade. Grade A demands >90% uniformity.`;
    }
    if (msg.includes('pest') || msg.includes('spray') || msg.includes('disease')) {
      return `For biological pest management, spray Neem oil (10,000 ppm) at 3ml/liter in evening hours. Avoid spraying close to harvest time.`;
    }
    return `Kisan Mitra, our KVK agricultural desk recommends following post-harvest protocols to maximize your mandi net realization. Feel free to ask anytime!`;
  }

  if (member.role === 'TRANSPORTER') {
    if (msg.includes('kalikiri') || msg.includes('pickup') || msg.includes('farm')) {
      return `Yes, our driver can reach Kalikiri within 30 minutes. 4-ton vehicle has clean crates ready.`;
    }
    if (msg.includes('rate') || msg.includes('freight') || msg.includes('charge')) {
      return `Standard rate is ₹2.20/kg for Bengaluru and ₹2.80/kg for Chennai corridor. No extra toll fee.`;
    }
    return `Driver contact is +91 90001 88776. Vehicle is fueled and ready for agricultural dispatch.`;
  }

  if (member.role === 'APMC_AGENT') {
    if (msg.includes('rate') || msg.includes('auction') || msg.includes('price')) {
      return `Today's modal auction opened firm! Grade A lots are clearing in top brackets. Bring by 7:00 AM for peak buyers.`;
    }
    return `Noted. Bring your farmer slip and Aadhaar copy at gate 2 for express electronic weighment.`;
  }

  return `Received your message Ramesh bhai! Let us stay in touch for better mandi coordination.`;
}

import type {
  Startup,
  UserProfile,
  EventConfig,
  Criterion,
  Room,
  FeedPost,
  Notification,
  ScoreEntry,
  ConnectionRequest,
  Message,
} from '@/types/pitchNight';

// ── Default Event ─────────────────────────────────────────────────────────────

export const DEFAULT_EVENT: EventConfig = {
  id: 'pitch-night-2026',
  name: 'Pitch Night',
  subtitle: 'Spring 2026 Demo Day',
  date: '2026-02-22',
  venue: 'Google Campus TLV, Tel Aviv',
  organizer: 'Startup Nation Central',
  isActive: true,
  scoresPublished: false,
};

// ── Default Rooms ─────────────────────────────────────────────────────────────

export const DEFAULT_ROOMS: Room[] = [
  { id: 'room-a', name: 'Main Stage', description: 'Main auditorium — 200 seats', capacity: 200 },
  { id: 'room-b', name: 'Innovation Lab', description: 'Side hall — 50 seats', capacity: 50 },
  { id: 'room-c', name: 'Founders Lounge', description: 'Intimate setting — 20 seats', capacity: 20 },
];

// ── Default Criteria ──────────────────────────────────────────────────────────

export const DEFAULT_CRITERIA: Criterion[] = [
  { id: 'innovation', label: 'Innovation', description: 'How novel and creative is the solution?', icon: '💡', maxScore: 10, order: 1 },
  { id: 'market', label: 'Market Opportunity', description: 'Size and accessibility of the target market', icon: '📈', maxScore: 10, order: 2 },
  { id: 'team', label: 'Team', description: 'Founder-market fit and team capabilities', icon: '👥', maxScore: 10, order: 3 },
  { id: 'execution', label: 'Execution & Traction', description: 'Evidence of progress and ability to deliver', icon: '🚀', maxScore: 10, order: 4 },
  { id: 'pitch', label: 'Pitch Quality', description: 'Clarity, storytelling, and presentation skills', icon: '🎤', maxScore: 10, order: 5 },
];

// ── Default Users ─────────────────────────────────────────────────────────────

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'admin-1',
    role: 'admin',
    name: 'Event Organizer',
    headline: 'Pitch Night Admin · Startup Nation Central',
    email: 'admin@pitchnight.com',
    connections: [],
    pendingConnections: [],
    sentConnections: [],
    followedStartups: [],
  },
  {
    id: 'judge-1',
    role: 'judge',
    name: 'Sarah Cohen',
    headline: 'Partner at Aleph VC',
    company: 'Aleph VC',
    title: 'Partner',
    connections: ['judge-2', 'judge-3'],
    pendingConnections: [],
    sentConnections: [],
    followedStartups: [],
  },
  {
    id: 'judge-2',
    role: 'judge',
    name: 'Ido Mor',
    headline: 'CEO at OurCrowd',
    company: 'OurCrowd',
    title: 'CEO',
    connections: ['judge-1'],
    pendingConnections: [],
    sentConnections: [],
    followedStartups: [],
  },
  {
    id: 'judge-3',
    role: 'judge',
    name: 'Maya Peled',
    headline: 'Angel Investor · Ex-Google',
    company: 'Independent',
    title: 'Angel Investor',
    connections: ['judge-1'],
    pendingConnections: [],
    sentConnections: [],
    followedStartups: [],
  },
];

// ── Default Startups ──────────────────────────────────────────────────────────

export const DEFAULT_STARTUPS: Startup[] = [
  {
    id: 'startup-1',
    name: 'NutriSense AI',
    tagline: 'AI-powered personalised nutrition for every body',
    description: 'NutriSense AI uses continuous glucose monitoring data combined with large language models to deliver hyper-personalised meal plans and real-time dietary coaching. Our app integrates with CGM devices and wearables to give users actionable insights that go beyond generic macro counting.',
    founder: 'Lior Ben-David',
    founderTitle: 'CEO & Co-founder',
    industry: 'HealthTech',
    stage: 'Seed',
    teamSize: 8,
    location: 'Tel Aviv, Israel',
    founded: '2023',
    askAmount: '$1.5M',
    website: 'https://nutrisense.ai',
    pitchOrder: 1,
    roomId: 'room-a',
    traction: '3,200 active users',
    problem: 'Generic diet advice fails 95% of people because metabolic responses to food are deeply individual.',
    solution: 'Real-time glucose data + AI = personalised nutrition that actually works.',
    tags: ['AI', 'Nutrition', 'CGM', 'Wearables', 'B2C'],
    accessCode: 'NUTRI2026',
    teamMemberIds: [],
    assignedJudgeIds: ['judge-1', 'judge-2'],
    connections: ['startup-3', 'startup-4'],
    followers: 47,
  },
  {
    id: 'startup-2',
    name: 'BuildFlow',
    tagline: 'Construction project management reimagined for the field',
    description: 'BuildFlow replaces clipboards and spreadsheets with an offline-first mobile platform built for construction crews. Foremen can log progress, flag issues, and track materials without an internet connection — everything syncs when back online.',
    founder: 'Ronit Shapira',
    founderTitle: 'CEO & Co-founder',
    industry: 'SaaS',
    stage: 'Pre-Seed',
    teamSize: 4,
    location: 'Haifa, Israel',
    founded: '2024',
    askAmount: '$600K',
    pitchOrder: 2,
    roomId: 'room-b',
    traction: '12 paying contractors',
    problem: 'Construction teams lose 20% of project time to manual reporting and miscommunication.',
    solution: 'Offline-first mobile app that keeps crews aligned and projects on schedule.',
    tags: ['PropTech', 'Offline-first', 'Mobile', 'B2B', 'SaaS'],
    accessCode: 'BUILD2026',
    teamMemberIds: [],
    assignedJudgeIds: ['judge-2', 'judge-3'],
    connections: ['startup-5'],
    followers: 23,
  },
  {
    id: 'startup-3',
    name: 'FarmLens',
    tagline: 'Satellite intelligence for smallholder farmers',
    description: 'FarmLens delivers weekly satellite-derived crop health reports to smallholder farmers via WhatsApp. Using multi-spectral imagery and ML, we detect irrigation stress, disease, and yield forecasts in near real-time.',
    founder: 'Amos Tal',
    founderTitle: 'CTO & Co-founder',
    industry: 'AgriTech',
    stage: 'MVP',
    teamSize: 5,
    location: 'Beer Sheva, Israel',
    founded: '2023',
    askAmount: '$800K',
    pitchOrder: 3,
    roomId: 'room-a',
    traction: '400 farms enrolled',
    problem: 'Smallholder farmers lack affordable access to agronomic expertise, losing 30% of crops to preventable issues.',
    solution: 'WhatsApp-native crop intelligence powered by satellite data and ML, at $5/month per farm.',
    tags: ['AgriTech', 'Satellite', 'ML', 'Emerging Markets', 'WhatsApp'],
    accessCode: 'FARM2026',
    teamMemberIds: [],
    assignedJudgeIds: ['judge-1', 'judge-3'],
    connections: ['startup-1'],
    followers: 31,
  },
  {
    id: 'startup-4',
    name: 'ClearPay',
    tagline: 'Instant B2B payments with embedded compliance',
    description: 'ClearPay embeds AML/KYC compliance directly into the payment flow so businesses can send and receive international B2B payments in seconds without compliance delays. Our API-first platform reduces cross-border payment friction by 80%.',
    founder: 'Noa Friedman',
    founderTitle: 'CEO & Founder',
    industry: 'FinTech',
    stage: 'Seed',
    teamSize: 11,
    location: 'Tel Aviv, Israel',
    founded: '2022',
    askAmount: '$3M',
    website: 'https://clearpay.io',
    pitchOrder: 4,
    roomId: 'room-a',
    traction: '$2.4M TPV last month',
    problem: 'B2B cross-border payments take 3–7 days due to fragmented compliance checks.',
    solution: 'Compliance-embedded payment rails that clear international B2B transactions in under 60 seconds.',
    tags: ['FinTech', 'Payments', 'B2B', 'Compliance', 'API'],
    accessCode: 'CLEAR2026',
    teamMemberIds: [],
    assignedJudgeIds: ['judge-1', 'judge-2', 'judge-3'],
    connections: ['startup-1', 'startup-5'],
    followers: 62,
  },
  {
    id: 'startup-5',
    name: 'SkillBridge',
    tagline: 'Upskilling for blue-collar workers, in their language',
    description: 'SkillBridge offers bite-sized vocational training courses available in 14 languages, tailored for blue-collar workers in construction, logistics, and manufacturing. Employers pay a monthly per-seat fee to upskill their workforce.',
    founder: 'Dina Katz',
    founderTitle: 'CEO & Co-founder',
    industry: 'EdTech',
    stage: 'Pre-Seed',
    teamSize: 6,
    location: 'Netanya, Israel',
    founded: '2024',
    askAmount: '$750K',
    pitchOrder: 5,
    roomId: 'room-b',
    traction: '3 enterprise pilots signed',
    problem: 'Blue-collar workers are locked out of career growth due to language barriers and inaccessible training.',
    solution: '5-minute daily microlearning modules in workers\' native languages, accessible on any smartphone.',
    tags: ['EdTech', 'Blue-collar', 'Multilingual', 'Workforce', 'B2B2C'],
    accessCode: 'SKILL2026',
    teamMemberIds: [],
    assignedJudgeIds: ['judge-2', 'judge-3'],
    connections: ['startup-2', 'startup-4'],
    followers: 19,
  },
];

// ── Default Feed Posts ────────────────────────────────────────────────────────

export const DEFAULT_FEED_POSTS: FeedPost[] = [
  {
    id: 'post-1',
    authorId: 'startup-4',
    authorName: 'Noa Friedman',
    authorHeadline: 'CEO & Founder at ClearPay',
    content: 'Excited to pitch at Pitch Night Spring 2026 tonight! ClearPay is redefining B2B cross-border payments — come find us on Main Stage #4. 🚀 #PitchNight2026 #FinTech',
    type: 'announcement',
    likes: 34,
    comments: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    startupId: 'startup-4',
  },
  {
    id: 'post-2',
    authorId: 'startup-1',
    authorName: 'Lior Ben-David',
    authorHeadline: 'CEO & Co-founder at NutriSense AI',
    content: 'We just crossed 3,200 active users! The metabolic health revolution is real. Looking forward to showcasing our journey tonight at Pitch Night. If you\'re curious about personalised nutrition powered by AI, come say hi! 💪 #HealthTech #AI',
    type: 'milestone',
    likes: 51,
    comments: [
      { id: 'c1', authorId: 'judge-1', authorName: 'Sarah Cohen', content: 'Impressive traction! Looking forward to your pitch.', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    startupId: 'startup-1',
  },
  {
    id: 'post-3',
    authorId: 'judge-2',
    authorName: 'Ido Mor',
    authorHeadline: 'CEO at OurCrowd',
    content: 'Judging at Pitch Night Spring 2026 tonight. Always inspired by the boldness of early-stage founders. The Israeli startup ecosystem keeps raising the bar. 🇮🇱 #StartupNation',
    type: 'update',
    likes: 88,
    comments: [],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-4',
    authorId: 'startup-3',
    authorName: 'Amos Tal',
    authorHeadline: 'CTO & Co-founder at FarmLens',
    content: '400 farms now using FarmLens to protect their crops with satellite data. From Beer Sheva to the fields — technology should work for everyone. Pitching tonight at Pitch Night! 🌾🛰️ #AgriTech',
    type: 'milestone',
    likes: 29,
    comments: [],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    startupId: 'startup-3',
  },
];

// ── Default Notifications ─────────────────────────────────────────────────────

export const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    targetStartupId: 'all',
    message: 'Welcome to Pitch Night Spring 2026! Please check in at the registration desk by 18:30.',
    type: 'info',
    sentAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    sentBy: 'Event Organizer',
    read: false,
  },
  {
    id: 'notif-2',
    targetStartupId: 'startup-1',
    message: 'NutriSense AI — you\'re first on Main Stage. Please be ready in the green room by 19:00.',
    type: 'action',
    sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    sentBy: 'Event Organizer',
    read: false,
  },
];

// ── Default Score Entries ─────────────────────────────────────────────────────

export const DEFAULT_SCORES: ScoreEntry[] = [];

// ── Default Connections ───────────────────────────────────────────────────────

export const DEFAULT_CONNECTIONS: ConnectionRequest[] = [];

// ── Default Messages ──────────────────────────────────────────────────────────

export const DEFAULT_MESSAGES: Message[] = [];

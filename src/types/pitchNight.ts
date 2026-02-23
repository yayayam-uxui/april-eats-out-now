// ── User / Auth ──────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'judge' | 'startup' | 'guest';

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  headline?: string; // LinkedIn-style subtitle
  avatarUrl?: string;
  linkedinUrl?: string;
  email?: string;
  // For judge
  company?: string;
  title?: string;
  // For startup
  startupId?: string;
  // Networking
  connections: string[]; // IDs of connected users
  pendingConnections: string[]; // incoming connection request IDs
  sentConnections: string[]; // outgoing connection request IDs
  followedStartups: string[]; // startup IDs audience is following
}

// ── Event & Rooms ─────────────────────────────────────────────────────────────

export interface Room {
  id: string;
  name: string;
  description?: string;
  capacity?: number;
}

export interface EventConfig {
  id: string;
  name: string;
  subtitle: string;
  date: string;
  venue: string;
  organizer: string;
  logoUrl?: string;
  isActive: boolean;
  scoresPublished: boolean;
}

// ── Criteria ──────────────────────────────────────────────────────────────────

export interface Criterion {
  id: string;
  label: string;
  description: string;
  icon: string;
  maxScore: number;
  order: number;
}

// ── Startups ──────────────────────────────────────────────────────────────────

export type StartupStage = 'Idea' | 'MVP' | 'Pre-Seed' | 'Seed' | 'Series A';
export type Industry =
  | 'FinTech'
  | 'HealthTech'
  | 'EdTech'
  | 'CleanTech'
  | 'AgriTech'
  | 'SaaS'
  | 'E-commerce'
  | 'AI/ML'
  | 'DeepTech'
  | 'Social Impact'
  | 'FoodTech'
  | 'PropTech'
  | 'HRTech'
  | 'LegalTech'
  | 'Marketplace';

export interface Startup {
  id: string;
  name: string;
  tagline: string;
  description: string;
  founder: string;
  founderTitle: string;
  industry: Industry;
  stage: StartupStage;
  teamSize: number;
  location: string;
  founded: string;
  askAmount?: string;
  website?: string;
  linkedinUrl?: string;
  logoUrl?: string;
  coverUrl?: string;
  pitchOrder: number;
  roomId?: string;
  traction?: string;
  problem: string;
  solution: string;
  tags: string[];
  pitchDeckUrl?: string;
  accessCode: string; // code startup team uses to log in
  teamMemberIds: string[]; // UserProfile IDs
  assignedJudgeIds: string[];
  connections: string[]; // IDs of startups connected to
  followers: number;
}

// ── Scoring ───────────────────────────────────────────────────────────────────

export interface ScoreEntry {
  id: string;
  startupId: string;
  judgeId: string;
  judgeName: string;
  scores: Record<string, number>; // criterionId -> score
  comment?: string;
  submittedAt: string;
  total: number; // weighted average
}

// ── Notifications ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  targetStartupId: string | 'all';
  message: string;
  type: 'info' | 'warning' | 'success' | 'action';
  sentAt: string;
  sentBy: string; // admin name
  read: boolean;
}

// ── Networking / Messages ─────────────────────────────────────────────────────

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
  read: boolean;
}

export interface ConnectionRequest {
  id: string;
  fromId: string;
  toId: string;
  sentAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

// ── Feed / Activity ───────────────────────────────────────────────────────────

export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorHeadline?: string;
  authorAvatarUrl?: string;
  content: string;
  type: 'update' | 'milestone' | 'announcement' | 'connection';
  likes: number;
  comments: FeedComment[];
  createdAt: string;
  startupId?: string;
}

export interface FeedComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

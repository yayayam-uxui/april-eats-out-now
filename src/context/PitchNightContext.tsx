import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  UserProfile,
  UserRole,
  Startup,
  EventConfig,
  Criterion,
  Room,
  ScoreEntry,
  Notification,
  FeedPost,
  Message,
  ConnectionRequest,
} from '@/types/pitchNight';
import {
  DEFAULT_EVENT,
  DEFAULT_USERS,
  DEFAULT_STARTUPS,
  DEFAULT_CRITERIA,
  DEFAULT_ROOMS,
  DEFAULT_FEED_POSTS,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_SCORES,
  DEFAULT_CONNECTIONS,
  DEFAULT_MESSAGES,
} from '@/data/pitchNightData';

// ── Storage helpers ───────────────────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

const KEYS = {
  event: 'pn_event',
  users: 'pn_users',
  startups: 'pn_startups',
  criteria: 'pn_criteria',
  rooms: 'pn_rooms',
  feed: 'pn_feed',
  notifications: 'pn_notifications',
  scores: 'pn_scores',
  connections: 'pn_connections',
  messages: 'pn_messages',
  currentUserId: 'pn_current_user_id',
};

// ── Context types ─────────────────────────────────────────────────────────────

interface PitchNightContextValue {
  // Auth
  currentUser: UserProfile | null;
  login: (role: UserRole, id: string) => void;
  logout: () => void;

  // Data
  event: EventConfig;
  users: UserProfile[];
  startups: Startup[];
  criteria: Criterion[];
  rooms: Room[];
  feed: FeedPost[];
  notifications: Notification[];
  scores: ScoreEntry[];
  connections: ConnectionRequest[];
  messages: Message[];

  // Event management
  updateEvent: (patch: Partial<EventConfig>) => void;

  // Startup management
  addStartup: (s: Startup) => void;
  updateStartup: (id: string, patch: Partial<Startup>) => void;
  deleteStartup: (id: string) => void;

  // User / Judge management
  addUser: (u: UserProfile) => void;
  updateUser: (id: string, patch: Partial<UserProfile>) => void;
  deleteUser: (id: string) => void;

  // Criteria management
  addCriterion: (c: Criterion) => void;
  updateCriterion: (id: string, patch: Partial<Criterion>) => void;
  deleteCriterion: (id: string) => void;

  // Room management
  addRoom: (r: Room) => void;
  updateRoom: (id: string, patch: Partial<Room>) => void;
  deleteRoom: (id: string) => void;

  // Scoring
  submitScore: (entry: ScoreEntry) => void;
  getStartupScores: (startupId: string) => ScoreEntry[];
  getJudgeScore: (startupId: string, judgeId: string) => ScoreEntry | undefined;
  getLeaderboard: () => { startup: Startup; avgScore: number; judgesCount: number }[];

  // Notifications
  sendNotification: (n: Omit<Notification, 'id' | 'sentAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  getStartupNotifications: (startupId: string) => Notification[];

  // Feed
  addPost: (post: Omit<FeedPost, 'id' | 'createdAt' | 'likes' | 'comments'>) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, authorId: string, authorName: string, content: string) => void;

  // Networking
  sendConnectionRequest: (fromId: string, toId: string) => void;
  acceptConnection: (requestId: string) => void;
  declineConnection: (requestId: string) => void;
  isConnected: (aId: string, bId: string) => boolean;
  getPendingRequests: (userId: string) => ConnectionRequest[];
  sendMessage: (senderId: string, receiverId: string, content: string) => void;
  getConversation: (aId: string, bId: string) => Message[];
  followStartup: (userId: string, startupId: string) => void;
  unfollowStartup: (userId: string, startupId: string) => void;

  // Utility
  getStartupByAccessCode: (code: string) => Startup | undefined;
  resetToDefaults: () => void;
}

// ── Context creation ──────────────────────────────────────────────────────────

const PitchNightContext = createContext<PitchNightContextValue | null>(null);

export function PitchNightProvider({ children }: { children: React.ReactNode }) {
  const [event, setEvent] = useState<EventConfig>(() => load(KEYS.event, DEFAULT_EVENT));
  const [users, setUsers] = useState<UserProfile[]>(() => load(KEYS.users, DEFAULT_USERS));
  const [startups, setStartups] = useState<Startup[]>(() => load(KEYS.startups, DEFAULT_STARTUPS));
  const [criteria, setCriteria] = useState<Criterion[]>(() => load(KEYS.criteria, DEFAULT_CRITERIA));
  const [rooms, setRooms] = useState<Room[]>(() => load(KEYS.rooms, DEFAULT_ROOMS));
  const [feed, setFeed] = useState<FeedPost[]>(() => load(KEYS.feed, DEFAULT_FEED_POSTS));
  const [notifications, setNotifications] = useState<Notification[]>(() => load(KEYS.notifications, DEFAULT_NOTIFICATIONS));
  const [scores, setScores] = useState<ScoreEntry[]>(() => load(KEYS.scores, DEFAULT_SCORES));
  const [connections, setConnections] = useState<ConnectionRequest[]>(() => load(KEYS.connections, DEFAULT_CONNECTIONS));
  const [messages, setMessages] = useState<Message[]>(() => load(KEYS.messages, DEFAULT_MESSAGES));
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => localStorage.getItem(KEYS.currentUserId));

  const currentUser = users.find((u) => u.id === currentUserId) ?? null;

  // Persist all state to localStorage on change
  useEffect(() => { save(KEYS.event, event); }, [event]);
  useEffect(() => { save(KEYS.users, users); }, [users]);
  useEffect(() => { save(KEYS.startups, startups); }, [startups]);
  useEffect(() => { save(KEYS.criteria, criteria); }, [criteria]);
  useEffect(() => { save(KEYS.rooms, rooms); }, [rooms]);
  useEffect(() => { save(KEYS.feed, feed); }, [feed]);
  useEffect(() => { save(KEYS.notifications, notifications); }, [notifications]);
  useEffect(() => { save(KEYS.scores, scores); }, [scores]);
  useEffect(() => { save(KEYS.connections, connections); }, [connections]);
  useEffect(() => { save(KEYS.messages, messages); }, [messages]);

  // ── Auth ──────────────────────────────────────────────────────────────────

  const login = useCallback((role: UserRole, id: string) => {
    localStorage.setItem(KEYS.currentUserId, id);
    setCurrentUserId(id);
    // Ensure user exists
    setUsers((prev) => {
      if (prev.find((u) => u.id === id)) return prev;
      const newUser: UserProfile = {
        id,
        role,
        name: id,
        connections: [],
        pendingConnections: [],
        sentConnections: [],
        followedStartups: [],
      };
      return [...prev, newUser];
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(KEYS.currentUserId);
    setCurrentUserId(null);
  }, []);

  // ── Event ─────────────────────────────────────────────────────────────────

  const updateEvent = useCallback((patch: Partial<EventConfig>) => {
    setEvent((prev) => ({ ...prev, ...patch }));
  }, []);

  // ── Startups ──────────────────────────────────────────────────────────────

  const addStartup = useCallback((s: Startup) => setStartups((p) => [...p, s]), []);
  const updateStartup = useCallback((id: string, patch: Partial<Startup>) =>
    setStartups((p) => p.map((s) => (s.id === id ? { ...s, ...patch } : s))), []);
  const deleteStartup = useCallback((id: string) =>
    setStartups((p) => p.filter((s) => s.id !== id)), []);

  // ── Users ─────────────────────────────────────────────────────────────────

  const addUser = useCallback((u: UserProfile) => setUsers((p) => [...p, u]), []);
  const updateUser = useCallback((id: string, patch: Partial<UserProfile>) =>
    setUsers((p) => p.map((u) => (u.id === id ? { ...u, ...patch } : u))), []);
  const deleteUser = useCallback((id: string) =>
    setUsers((p) => p.filter((u) => u.id !== id)), []);

  // ── Criteria ──────────────────────────────────────────────────────────────

  const addCriterion = useCallback((c: Criterion) => setCriteria((p) => [...p, c]), []);
  const updateCriterion = useCallback((id: string, patch: Partial<Criterion>) =>
    setCriteria((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c))), []);
  const deleteCriterion = useCallback((id: string) =>
    setCriteria((p) => p.filter((c) => c.id !== id)), []);

  // ── Rooms ─────────────────────────────────────────────────────────────────

  const addRoom = useCallback((r: Room) => setRooms((p) => [...p, r]), []);
  const updateRoom = useCallback((id: string, patch: Partial<Room>) =>
    setRooms((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r))), []);
  const deleteRoom = useCallback((id: string) =>
    setRooms((p) => p.filter((r) => r.id !== id)), []);

  // ── Scoring ───────────────────────────────────────────────────────────────

  const submitScore = useCallback((entry: ScoreEntry) => {
    setScores((p) => {
      const filtered = p.filter((s) => !(s.startupId === entry.startupId && s.judgeId === entry.judgeId));
      return [...filtered, entry];
    });
  }, []);

  const getStartupScores = useCallback((startupId: string) =>
    scores.filter((s) => s.startupId === startupId), [scores]);

  const getJudgeScore = useCallback((startupId: string, judgeId: string) =>
    scores.find((s) => s.startupId === startupId && s.judgeId === judgeId), [scores]);

  const getLeaderboard = useCallback(() => {
    return startups.map((startup) => {
      const startupScores = scores.filter((s) => s.startupId === startup.id);
      const avgScore = startupScores.length
        ? startupScores.reduce((sum, s) => sum + s.total, 0) / startupScores.length
        : 0;
      return { startup, avgScore, judgesCount: startupScores.length };
    }).sort((a, b) => b.avgScore - a.avgScore);
  }, [startups, scores]);

  // ── Notifications ─────────────────────────────────────────────────────────

  const sendNotification = useCallback((n: Omit<Notification, 'id' | 'sentAt' | 'read'>) => {
    const full: Notification = {
      ...n,
      id: `notif-${Date.now()}`,
      sentAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((p) => [full, ...p]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const getStartupNotifications = useCallback((startupId: string) =>
    notifications.filter((n) => n.targetStartupId === 'all' || n.targetStartupId === startupId), [notifications]);

  // ── Feed ──────────────────────────────────────────────────────────────────

  const addPost = useCallback((post: Omit<FeedPost, 'id' | 'createdAt' | 'likes' | 'comments'>) => {
    const full: FeedPost = { ...post, id: `post-${Date.now()}`, createdAt: new Date().toISOString(), likes: 0, comments: [] };
    setFeed((p) => [full, ...p]);
  }, []);

  const likePost = useCallback((postId: string) => {
    setFeed((p) => p.map((post) => post.id === postId ? { ...post, likes: post.likes + 1 } : post));
  }, []);

  const addComment = useCallback((postId: string, authorId: string, authorName: string, content: string) => {
    setFeed((p) => p.map((post) => {
      if (post.id !== postId) return post;
      return {
        ...post,
        comments: [...post.comments, {
          id: `c-${Date.now()}`,
          authorId,
          authorName,
          content,
          createdAt: new Date().toISOString(),
        }],
      };
    }));
  }, []);

  // ── Networking ────────────────────────────────────────────────────────────

  const sendConnectionRequest = useCallback((fromId: string, toId: string) => {
    const req: ConnectionRequest = {
      id: `req-${Date.now()}`,
      fromId,
      toId,
      sentAt: new Date().toISOString(),
      status: 'pending',
    };
    setConnections((p) => [...p, req]);
    setUsers((p) => p.map((u) => {
      if (u.id === fromId) return { ...u, sentConnections: [...u.sentConnections, toId] };
      if (u.id === toId) return { ...u, pendingConnections: [...u.pendingConnections, fromId] };
      return u;
    }));
  }, []);

  const acceptConnection = useCallback((requestId: string) => {
    const req = connections.find((c) => c.id === requestId);
    if (!req) return;
    setConnections((p) => p.map((c) => c.id === requestId ? { ...c, status: 'accepted' } : c));
    setUsers((p) => p.map((u) => {
      if (u.id === req.fromId) return { ...u, connections: [...u.connections, req.toId], sentConnections: u.sentConnections.filter((id) => id !== req.toId) };
      if (u.id === req.toId) return { ...u, connections: [...u.connections, req.fromId], pendingConnections: u.pendingConnections.filter((id) => id !== req.fromId) };
      return u;
    }));
  }, [connections]);

  const declineConnection = useCallback((requestId: string) => {
    const req = connections.find((c) => c.id === requestId);
    if (!req) return;
    setConnections((p) => p.map((c) => c.id === requestId ? { ...c, status: 'declined' } : c));
    setUsers((p) => p.map((u) => {
      if (u.id === req.fromId) return { ...u, sentConnections: u.sentConnections.filter((id) => id !== req.toId) };
      if (u.id === req.toId) return { ...u, pendingConnections: u.pendingConnections.filter((id) => id !== req.fromId) };
      return u;
    }));
  }, [connections]);

  const isConnected = useCallback((aId: string, bId: string) => {
    return connections.some((c) => c.status === 'accepted' && ((c.fromId === aId && c.toId === bId) || (c.fromId === bId && c.toId === aId)));
  }, [connections]);

  const getPendingRequests = useCallback((userId: string) =>
    connections.filter((c) => c.toId === userId && c.status === 'pending'), [connections]);

  const sendMessage = useCallback((senderId: string, receiverId: string, content: string) => {
    const msg: Message = {
      id: `msg-${Date.now()}`,
      senderId,
      receiverId,
      content,
      sentAt: new Date().toISOString(),
      read: false,
    };
    setMessages((p) => [...p, msg]);
  }, []);

  const getConversation = useCallback((aId: string, bId: string) =>
    messages.filter((m) => (m.senderId === aId && m.receiverId === bId) || (m.senderId === bId && m.receiverId === aId))
      .sort((a, b) => a.sentAt.localeCompare(b.sentAt)), [messages]);

  const followStartup = useCallback((userId: string, startupId: string) => {
    setUsers((p) => p.map((u) => u.id === userId ? { ...u, followedStartups: [...u.followedStartups, startupId] } : u));
    setStartups((p) => p.map((s) => s.id === startupId ? { ...s, followers: s.followers + 1 } : s));
  }, []);

  const unfollowStartup = useCallback((userId: string, startupId: string) => {
    setUsers((p) => p.map((u) => u.id === userId ? { ...u, followedStartups: u.followedStartups.filter((id) => id !== startupId) } : u));
    setStartups((p) => p.map((s) => s.id === startupId ? { ...s, followers: Math.max(0, s.followers - 1) } : s));
  }, []);

  // ── Utility ───────────────────────────────────────────────────────────────

  const getStartupByAccessCode = useCallback((code: string) =>
    startups.find((s) => s.accessCode.toUpperCase() === code.toUpperCase()), [startups]);

  const resetToDefaults = useCallback(() => {
    setEvent(DEFAULT_EVENT);
    setUsers(DEFAULT_USERS);
    setStartups(DEFAULT_STARTUPS);
    setCriteria(DEFAULT_CRITERIA);
    setRooms(DEFAULT_ROOMS);
    setFeed(DEFAULT_FEED_POSTS);
    setNotifications(DEFAULT_NOTIFICATIONS);
    setScores(DEFAULT_SCORES);
    setConnections(DEFAULT_CONNECTIONS);
    setMessages(DEFAULT_MESSAGES);
    localStorage.removeItem(KEYS.currentUserId);
    setCurrentUserId(null);
  }, []);

  const value: PitchNightContextValue = {
    currentUser,
    login,
    logout,
    event,
    users,
    startups,
    criteria,
    rooms,
    feed,
    notifications,
    scores,
    connections,
    messages,
    updateEvent,
    addStartup,
    updateStartup,
    deleteStartup,
    addUser,
    updateUser,
    deleteUser,
    addCriterion,
    updateCriterion,
    deleteCriterion,
    addRoom,
    updateRoom,
    deleteRoom,
    submitScore,
    getStartupScores,
    getJudgeScore,
    getLeaderboard,
    sendNotification,
    markNotificationRead,
    getStartupNotifications,
    addPost,
    likePost,
    addComment,
    sendConnectionRequest,
    acceptConnection,
    declineConnection,
    isConnected,
    getPendingRequests,
    sendMessage,
    getConversation,
    followStartup,
    unfollowStartup,
    getStartupByAccessCode,
    resetToDefaults,
  };

  return <PitchNightContext.Provider value={value}>{children}</PitchNightContext.Provider>;
}

export function usePitchNight(): PitchNightContextValue {
  const ctx = useContext(PitchNightContext);
  if (!ctx) throw new Error('usePitchNight must be used within PitchNightProvider');
  return ctx;
}

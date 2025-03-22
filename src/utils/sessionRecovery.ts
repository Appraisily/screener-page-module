/**
 * Session Recovery and Cleanup Service
 * 
 * This utility provides functions to handle orphaned or stalled analysis sessions,
 * recover from interrupted operations, and clean up abandoned sessions.
 */

// Session storage keys
const SESSION_STORE_KEY = 'screener_active_sessions';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// Session state type
export type SessionState = {
  sessionId: string;
  startedAt: number;
  lastUpdatedAt: number;
  status: 'active' | 'complete' | 'error' | 'abandoned';
  currentStep?: string;
  customerImageUrl?: string;
};

/**
 * Registers a new active analysis session
 * 
 * @param sessionId The session identifier
 * @param imageUrl Optional image URL associated with session
 * @returns The stored session state
 */
export function registerSession(sessionId: string, imageUrl?: string): SessionState {
  const now = Date.now();
  const sessionState: SessionState = {
    sessionId,
    startedAt: now,
    lastUpdatedAt: now,
    status: 'active',
    customerImageUrl: imageUrl
  };
  
  // Get existing sessions
  const sessions = getStoredSessions();
  
  // Add new session
  sessions[sessionId] = sessionState;
  
  // Store updated sessions
  storeSessionStates(sessions);
  
  return sessionState;
}

/**
 * Updates the state of an existing session
 * 
 * @param sessionId The session identifier
 * @param updates Partial session state updates
 * @returns The updated session state or null if session not found
 */
export function updateSessionState(
  sessionId: string, 
  updates: Partial<Omit<SessionState, 'sessionId' | 'startedAt'>>
): SessionState | null {
  const sessions = getStoredSessions();
  const session = sessions[sessionId];
  
  if (!session) return null;
  
  // Update session with new values and timestamp
  const updatedSession = {
    ...session,
    ...updates,
    lastUpdatedAt: Date.now()
  };
  
  sessions[sessionId] = updatedSession;
  storeSessionStates(sessions);
  
  return updatedSession;
}

/**
 * Marks a session as complete
 * 
 * @param sessionId The session identifier
 * @returns The updated session state or null if not found
 */
export function completeSession(sessionId: string): SessionState | null {
  return updateSessionState(sessionId, { status: 'complete' });
}

/**
 * Marks a session as having an error
 * 
 * @param sessionId The session identifier
 * @returns The updated session state or null if not found
 */
export function markSessionError(sessionId: string): SessionState | null {
  return updateSessionState(sessionId, { status: 'error' });
}

/**
 * Gets details about a specific session
 * 
 * @param sessionId The session identifier
 * @returns The session state or null if not found
 */
export function getSession(sessionId: string): SessionState | null {
  const sessions = getStoredSessions();
  return sessions[sessionId] || null;
}

/**
 * Checks if a session has timed out (been inactive too long)
 * 
 * @param sessionState The session state to check
 * @returns True if the session has timed out
 */
export function hasSessionTimedOut(sessionState: SessionState): boolean {
  const now = Date.now();
  return (
    sessionState.status === 'active' && 
    now - sessionState.lastUpdatedAt > SESSION_TIMEOUT_MS
  );
}

/**
 * Identifies and cleans up abandoned sessions
 * 
 * @returns Array of cleaned up session IDs
 */
export function cleanupAbandonedSessions(): string[] {
  const sessions = getStoredSessions();
  const abandonedSessionIds: string[] = [];
  const now = Date.now();
  
  // Identify abandoned sessions
  Object.keys(sessions).forEach(sessionId => {
    const session = sessions[sessionId];
    
    // Check for abandoned active sessions
    if (session.status === 'active' && now - session.lastUpdatedAt > SESSION_TIMEOUT_MS) {
      sessions[sessionId] = {
        ...session,
        status: 'abandoned',
        lastUpdatedAt: now
      };
      
      abandonedSessionIds.push(sessionId);
    }
  });
  
  // Store updated sessions
  if (abandonedSessionIds.length > 0) {
    storeSessionStates(sessions);
  }
  
  return abandonedSessionIds;
}

/**
 * Checks for any active session that may need recovery
 * 
 * @returns The active session state or null if none found
 */
export function findRecoverableSession(): SessionState | null {
  const sessions = getStoredSessions();
  const now = Date.now();
  
  // Look for active sessions that haven't timed out yet
  const activeSessions = Object.values(sessions).filter(
    session => session.status === 'active' && 
               now - session.lastUpdatedAt < SESSION_TIMEOUT_MS
  );
  
  // Sort by last updated (most recent first)
  activeSessions.sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt);
  
  return activeSessions.length > 0 ? activeSessions[0] : null;
}

/**
 * Removes all sessions and session data from storage
 */
export function clearAllSessions(): void {
  localStorage.removeItem(SESSION_STORE_KEY);
}

// Private helper functions

/**
 * Gets all stored session states from local storage
 * 
 * @returns Record of session states by ID
 */
function getStoredSessions(): Record<string, SessionState> {
  try {
    const sessionsJson = localStorage.getItem(SESSION_STORE_KEY);
    return sessionsJson ? JSON.parse(sessionsJson) : {};
  } catch (error) {
    console.error('Error reading session states from localStorage:', error);
    return {};
  }
}

/**
 * Stores all session states to local storage
 * 
 * @param sessions Record of session states by ID
 */
function storeSessionStates(sessions: Record<string, SessionState>): void {
  try {
    localStorage.setItem(SESSION_STORE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error storing session states to localStorage:', error);
  }
}
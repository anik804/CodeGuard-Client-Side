const API_BASE_URL =  "https://codeguard-server-side-walb.onrender.com";
// import.meta.env.VITE_API_URL ||
export const api = {
  // Analytics endpoints
  getAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/api/analytics`);
    if (!response.ok) throw new Error("Failed to fetch analytics");
    return response.json();
  },
  
  getPlatformStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/platform-stats`);
    if (!response.ok) throw new Error("Failed to fetch platform stats");
    return response.json();
  },
  
  getExamAttendance: async (roomId = null) => {
    const url = roomId 
      ? `${API_BASE_URL}/api/analytics/exam-attendance?roomId=${roomId}`
      : `${API_BASE_URL}/api/analytics/exam-attendance`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch exam attendance");
    return response.json();
  },
  
  getFlagsPerExam: async () => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/flags-per-exam`);
    if (!response.ok) throw new Error("Failed to fetch flags per exam");
    return response.json();
  },
  
  getFlaggedPercentage: async (roomId = null) => {
    const url = roomId 
      ? `${API_BASE_URL}/api/analytics/flagged-percentage?roomId=${roomId}`
      : `${API_BASE_URL}/api/analytics/flagged-percentage`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch flagged percentage");
    return response.json();
  },
  
  getConnectedUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/connected-users`);
    if (!response.ok) throw new Error("Failed to fetch connected users");
    return response.json();
  },
  
  getMonthlyStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/monthly-stats`);
    if (!response.ok) throw new Error("Failed to fetch monthly stats");
    return response.json();
  },
  
  getImpactMetrics: async () => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/impact`);
    if (!response.ok) throw new Error("Failed to fetch impact metrics");
    return response.json();
  },

  // Student analytics endpoints
  getStudentAnalytics: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/student/${studentId}`);
    if (!response.ok) throw new Error("Failed to fetch student analytics");
    return response.json();
  },

  refreshStudentAnalytics: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/student/${studentId}/refresh`, {
      method: "POST"
    });
    if (!response.ok) throw new Error("Failed to refresh student analytics");
    return response.json();
  },

  refreshAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/api/analytics/refresh`, {
      method: "POST"
    });
    if (!response.ok) throw new Error("Failed to refresh analytics");
    return response.json();
  }
};


/**
 * Centralized API URL Configuration
 * 
 * Usage:
 * - If VITE_API_URL is set in .env, it will be used (live server mode)
 * - If VITE_API_URL is commented/not set, defaults to localhost (development mode)
 * 
 * To switch between modes:
 * - Live server: Uncomment VITE_API_URL in .env file
 * - Localhost: Comment or remove VITE_API_URL from .env file
 */

// Default localhost API URL
const DEFAULT_LOCALHOST_API = 'http://localhost:3000';

// Live server API URL (default fallback)
const DEFAULT_LIVE_API = 'http://localhost:3000';

// Check if VITE_API_URL is set in environment
const apiUrl = import.meta.env.VITE_API_URL;

// Determine if we're in live server mode
const isLiveServer = !!apiUrl;

// Get the active API URL
const getApiUrl = () => {
  if (apiUrl) {
    // Use VITE_API_URL from .env if set
    return apiUrl;
  }
  // Return localhost URL for development
  return DEFAULT_LOCALHOST_API;
};

// Export configuration
export const apiConfig = {
  // Current active API URL
  apiUrl: getApiUrl(),
  
  // Base API URL (same as apiUrl, kept for compatibility)
  baseUrl: getApiUrl(),
  
  // Whether we're running in live server mode
  isLiveServer,
  
  // Default URLs
  localhostApi: DEFAULT_LOCALHOST_API,
  liveApi: DEFAULT_LIVE_API,
};

// Log configuration (only in development)
if (import.meta.env.DEV) {
  console.log('🌐 API Configuration:');
  console.log(`   Mode: ${isLiveServer ? 'LIVE SERVER' : 'LOCALHOST (Development)'}`);
  console.log(`   Active API URL: ${apiConfig.apiUrl}`);
}

export default apiConfig;


import { useState, useEffect, useCallback } from 'react';

/**
 * Browser Detection
 */
export const detectBrowser = () => {
  if (typeof window === 'undefined') return 'unknown';

  const userAgent = navigator.userAgent.toLowerCase();
  
  // Brave browser (must be checked before Chrome as it also contains 'chrome')
  if (navigator.brave && navigator.brave.isBrave) {
    return 'brave';
  }
  // Also check user agent for Brave
  if (userAgent.includes('brave')) {
    return 'brave';
  }
  
  // Edge Chromium (check before Chrome)
  if (userAgent.includes('edg/')) {
    return 'edge';
  }
  
  // Opera (check before Chrome)
  if (userAgent.includes('opr/') || userAgent.includes('opera')) {
    return 'opera';
  }
  
  // Chrome (including Edge Chromium)
  if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
    return 'chrome';
  }
  
  // Firefox
  if (userAgent.includes('firefox')) {
    return 'firefox';
  }
  
  // Safari
  if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return 'safari';
  }
  
  return 'unknown';
};

/**
 * Extension Detection Hook
 * Detects if CodeGuard extension is installed and active
 */
export function useExtensionDetection() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [browser, setBrowser] = useState('unknown');
  const [error, setError] = useState(null);

  // Check extension availability
  const checkExtension = useCallback(() => {
    setIsChecking(true);
    setError(null);

    return new Promise((resolve) => {
      // Send PING message to extension
      window.postMessage(
        {
          target: 'CODEGUARD_EXTENSION',
          message: { type: 'PING' }
        },
        window.location.origin
      );

      // Set up listener for PONG response
      const timeout = setTimeout(() => {
        window.removeEventListener('message', handler);
        setIsInstalled(false);
        setIsChecking(false);
        resolve(false);
      }, 2000); // 2 second timeout

      const handler = (event) => {
        // Only accept messages from same origin
        if (event.origin !== window.location.origin) return;

        if (
          event.data?.target === 'CODEGUARD_WEB_APP' &&
          event.data?.type === 'PONG'
        ) {
          clearTimeout(timeout);
          window.removeEventListener('message', handler);
          setIsInstalled(true);
          setIsChecking(false);
          resolve(true);
        }
      };

      window.addEventListener('message', handler);
    });
  }, []);

  // Initial check on mount (only once)
  useEffect(() => {
    const detectedBrowser = detectBrowser();
    setBrowser(detectedBrowser);

    // Only check for Chrome/Edge/Opera/Brave (extension only works there)
    if (detectedBrowser === 'chrome' || detectedBrowser === 'edge' || detectedBrowser === 'opera' || detectedBrowser === 'brave') {
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        checkExtension();
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setIsChecking(false);
      setIsInstalled(false);
    }
  }, [checkExtension]);

  // No periodic re-check - user must click "Check Again" button manually

  return {
    isInstalled,
    isChecking,
    browser,
    error,
    checkExtension, // Expose manual check function
  };
}


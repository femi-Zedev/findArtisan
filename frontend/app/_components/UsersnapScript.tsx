'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    onUsersnapLoad?: (api: any) => void;
  }
}

export function UsersnapScript() {
  useEffect(() => {
    // Set up the callback function
    window.onUsersnapLoad = function(api: any) {
      api.init();
    };

    // Create and append the script
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://widget.usersnap.com/global/load/e3bd954f-4eaa-434f-8928-c8836e60380e?onload=onUsersnapLoad';
    
    const head = document.getElementsByTagName('head')[0];
    if (head) {
      head.appendChild(script);
    }

    // Cleanup function to remove script on unmount
    return () => {
      if (head && script.parentNode) {
        head.removeChild(script);
      }
      // Clean up the global callback
      delete window.onUsersnapLoad;
    };
  }, []);

  return null;
}


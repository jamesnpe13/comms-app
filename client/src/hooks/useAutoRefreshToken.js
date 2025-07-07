import { useEffect } from 'react';
import { decodeToken } from '../utils/decodeToken';

export default function useAutoRefreshToken(token, refreshTokenFunction) {
  useEffect(() => {
    if (!token) return;

    const { exp } = decodeToken(token);
    const timeDiff = exp * 1000 - Date.now();
    const timeAdvance = 1; //  minutes ahead
    const timeUntillRefresh = timeDiff - timeAdvance * 60000;

    const timeoutId = setTimeout(() => {
      refreshTokenFunction();
    }, timeUntillRefresh);

    return () => clearTimeout(timeoutId);
  }, [token, refreshTokenFunction]);
}

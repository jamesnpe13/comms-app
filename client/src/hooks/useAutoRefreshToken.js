import { useEffect } from 'react';
import { decodeToken } from '../utils/decodeToken';

export default function useAutoRefreshToken(token, refreshTokenFunction) {
  useEffect(() => {
    if (!token) return;

    const { exp } = decodeToken(token);
    const timeDiff = exp * 1000 - Date.now();
    const timeAdvance = 0; // 1 minute in advance
    const timeUntillRefresh = timeDiff - timeAdvance;

    const timeoutId = setTimeout(() => {
      refreshTokenFunction();
    }, timeUntillRefresh);

    return () => clearTimeout(timeoutId);
  }, [token, refreshTokenFunction]);
}

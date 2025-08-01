import { useEffect } from 'react';
import { decodeToken } from '../utils/decodeToken';

// export default function useAutoRefreshToken(token, refreshTokenFunction) {
//   useEffect(() => {
//     if (!token) return;

//     const { exp } = decodeToken(token);
//     const timeDiff = exp * 1000 - Date.now();
//     const timeAdvance = 1; //  minutes ahead
//     const timeUntillRefresh = timeDiff - timeAdvance * 60000;

//     const timeoutId = setTimeout(() => {
//       refreshTokenFunction();
//     }, timeUntillRefresh);

//     return () => clearTimeout(timeoutId);
//   }, [token, refreshTokenFunction]);
// }

export default function useAutoRefreshToken(token, refreshTokenFunction) {
  useEffect(() => {
    if (!token) return;

    const { exp } = decodeToken(token);
    if (!exp || typeof exp !== 'number') return;

    const timeDiff = exp * 1000 - Date.now(); // ms until expiry
    const timeAdvance = 1 * 60 * 1000; // 1 minute in ms
    const timeUntilRefresh = timeDiff - timeAdvance;

    if (timeUntilRefresh <= 0) {
      // Refresh immediately if token is expired or about to expire
      refreshTokenFunction();
      return;
    }

    const timeoutId = setTimeout(() => {
      refreshTokenFunction();
    }, timeUntilRefresh);

    return () => clearTimeout(timeoutId);
  }, [token, refreshTokenFunction]);
}

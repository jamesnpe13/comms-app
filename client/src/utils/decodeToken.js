import { jwtDecode } from 'jwt-decode';
export function decodeToken(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.log(error);
  }
}

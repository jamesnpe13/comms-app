export function storeLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function storeSessionStorage(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
export function getSessionStorage(key) {
  return JSON.parse(sessionStorage.getItem(key));
}

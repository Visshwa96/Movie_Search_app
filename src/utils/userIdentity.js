// src/utils/userIdentity.js
export function getOrCreateUserToken() {
  let token = localStorage.getItem("userToken");

  if (!token) {
    token = crypto.randomUUID(); // modern browsers
    localStorage.setItem("userToken", token);
  }

  return token;
}

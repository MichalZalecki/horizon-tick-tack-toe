import horizon from "@horizon/client";
import jwtDecode from "jwt-decode";
import hz from "../horizon";

export function login(provider) {
  hz.authEndpoint(provider).subscribe((endpoint) => {
    window.location.replace(endpoint);
  });
}

export function logout() {
  horizon.clearAuthTokens();
  window.location.href = "/";
}

export function isLoggedIn() {
  return hz.hasAuthToken();
}

export function currentUser() {
  return jwtDecode(localStorage.getItem("horizon-jwt"));
}

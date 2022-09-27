import storage from "store2";
import axios from "axios";
import CONFIG from "@/config.json";
import qs from "qs";
import moment from 'moment'
import db from "./idb";

export function setRefreshToken(token) {
  storage.set("refresh_token", token);
}

export function setAccessToken(token) {
  storage.set("access_token", token)
}

export function getAccessToken() {
  return storage.get("access_token", "")
}

export function isLoggedIn() {
  return storage.get("refresh_token", "").length > 0 && !isRefreshTokenExpired()
}

export function deleteToken() {
  storage.remove("access_token")
  storage.remove("refresh_token")
}

export function clearAccountInformation() {
  storage.remove("access_token")
  storage.remove("refresh_token")

  storage.remove("last_bookmark_modify")
  db["bookmark"].clear()
  storage.remove("last_follow_modify")
  db["follow"].clear()
}

function parseJwt(token) { // https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
  let base64Url = token.split('.')[1]
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
  return JSON.parse(jsonPayload)
}

function isTokenExpired(token) {
  let info = parseJwt(token)
  return moment.unix(info.exp).isBefore(moment())
}

export function getUserInfo() {
  return parseJwt(storage.get("refresh_token", null))
}

export function isRefreshTokenExpired() {
  return isTokenExpired(storage.get("refresh_token", null))
}

export function isAccessTokenExpired() {
  return isTokenExpired(storage.get("access_token", null))
}

export async function renewAccessTokenIfExpired() {
  if (isAccessTokenExpired()) {
    return renewAccessToken()
  }
  return true
}

export async function renewAccessToken() {
  let refresh_token = storage.get("refresh_token", null)
  if (refresh_token === null) {
    return false
  }
  let data = {
    refresh_token: refresh_token
  }
  try {
    let res = await axios.post(CONFIG.AUTHUGETSU_API + "user/refresh", qs.stringify(data))
    storage.set("access_token", res.data.access_token)
  } catch(e) {
    console.error(e)
    return false
  }
  return true
}

if (!isLoggedIn()) {
  if (storage.has("refresh_token")) {
    clearAccountInformation()
  }
}
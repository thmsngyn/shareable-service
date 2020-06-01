import jwt from "jsonwebtoken";
import config from "../config";

function getToken(req, headerName = "Authorization") {
  const header = req.get(headerName);
  const parts = (header && header.split(" ")) || [];

  if (parts.length === 2 && parts[0] === "Bearer") {
    return parts[1];
  }
  return undefined;
}

function hasAdminAccess(token) {
  return token === config.accessKey;
}

export function auth(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).send("Access denied.");
  }

  try {
    if (hasAdminAccess(token)) {
      next();
    } else {
      jwt.verify(token, config.accessKey);
      next();
    }
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}

export function handleSpotifyToken(req, res, next) {
  req.spotifyToken = getToken(req, "Proxy-Authorization");
  next();
}

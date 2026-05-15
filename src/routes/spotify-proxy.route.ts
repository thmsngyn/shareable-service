import express from "express";
import fetch from "node-fetch";
import config from "../config";

const Router = express.Router();

const SCOPES = [
  "user-top-read",
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-library-read",
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-library-modify",
  "user-follow-read",
];

const SPOTIFY_API_BASE = "https://api.spotify.com";
const SPOTIFY_AUTH_BASE = "https://accounts.spotify.com";

// GET /spotify-proxy/auth/url
Router.get("/auth/url", (req, res) => {
  const { code_challenge, redirect_uri } = req.query;

  if (!code_challenge || !redirect_uri) {
    return res
      .status(400)
      .json({ error: "code_challenge and redirect_uri are required" });
  }

  const params = new URLSearchParams({
    client_id: config.spotifyClientId,
    redirect_uri: redirect_uri as string,
    scope: SCOPES.join(" "),
    response_type: "code",
    code_challenge_method: "S256",
    code_challenge: code_challenge as string,
    show_dialog: "true",
  });

  res.json({ url: `${SPOTIFY_AUTH_BASE}/authorize?${params.toString()}` });
});

// POST /spotify-proxy/auth/token
Router.post("/auth/token", async (req, res) => {
  const { code, redirect_uri, code_verifier } = req.body;

  if (!code || !redirect_uri || !code_verifier) {
    return res
      .status(400)
      .json({ error: "code, redirect_uri, and code_verifier are required" });
  }

  try {
    const response = await fetch(`${SPOTIFY_AUTH_BASE}/api/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri,
        client_id: config.spotifyClientId,
        code_verifier,
      }),
    });

    const data = await response.text();
    res.set("Content-Type", "application/json");
    res.status(response.status).send(data);
  } catch {
    res.status(500).json({ error: "Token exchange failed" });
  }
});

// Catch-all: forward to Spotify API
Router.use("/", async (req, res) => {
  const token = req.headers["oauth-authorization"] as string;

  if (!token) {
    return res
      .status(401)
      .json({ error: "OAuth-Authorization header is required" });
  }

  const spotifyUrl = `${SPOTIFY_API_BASE}${req.url}`;

  try {
    const headers: Record<string, string> = {
      Authorization: token,
    };

    const hasBody = req.body && Object.keys(req.body).length > 0;
    if (hasBody) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(spotifyUrl, {
      method: req.method,
      headers,
      body: hasBody ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.text();
    res
      .set(
        "Content-Type",
        response.headers.get("content-type") || "application/json"
      )
      .status(response.status)
      .send(data);
  } catch {
    res.status(500).json({ error: "Proxy request failed" });
  }
});

export default Router;

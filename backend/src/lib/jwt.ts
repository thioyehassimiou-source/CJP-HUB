import crypto from "node:crypto";
import type { Role } from "@prisma/client";
import { env } from "../config/env";

export type JwtPayload = {
  sub: string;
  role: Role;
  exp: number;
};

function base64UrlEncode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

export function signToken(userId: string, role: Role) {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload: JwtPayload = {
    sub: userId,
    role,
    exp: Math.floor(Date.now() / 1000) + env.jwtExpiresInSeconds,
  };
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", env.jwtSecret)
    .update(`${header}.${body}`)
    .digest("base64url");

  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): JwtPayload {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Token invalide");
  }

  const [header, body, signature] = parts;
  const expected = crypto
    .createHmac("sha256", env.jwtSecret)
    .update(`${header}.${body}`)
    .digest("base64url");

  if (signature !== expected) {
    throw new Error("Signature invalide");
  }

  const payload = JSON.parse(base64UrlDecode(body)) as JwtPayload;

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expiré");
  }

  return payload;
}

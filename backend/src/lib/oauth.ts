import crypto from "crypto";

// === GOOGLE OAUTH ===
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "dummy_google_id";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "dummy_google_secret";
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback";

export function getGoogleAuthUrl(state: string) {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = new URLSearchParams({
    redirect_uri: GOOGLE_REDIRECT_URI,
    client_id: GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    state,
  });
  return `${rootUrl}?${options.toString()}`;
}

export async function getGoogleOAuthTokens({ code }: { code: string }) {
  const url = "https://oauth2.googleapis.com/token";
  const values = new URLSearchParams({
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: values.toString(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Google OAuth Tokens: ${await res.text()}`);
  }

  return res.json() as Promise<{
    access_token: string;
    id_token: string;
    expires_in: number;
    refresh_token: string;
    token_type: string;
    scope: string;
  }>;
}

export async function getGoogleUser(id_token: string, access_token: string) {
  const res = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Google User: ${await res.text()}`);
  }

  return res.json() as Promise<{
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
  }>;
}

// === GITHUB OAUTH ===
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "dummy_github_id";
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "dummy_github_secret";
export const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || "http://localhost:3000/api/auth/github/callback";

export function getGithubAuthUrl(state: string) {
  const rootUrl = "https://github.com/login/oauth/authorize";
  const options = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: "user:email",
    state,
  });
  return `${rootUrl}?${options.toString()}`;
}

export async function getGithubOAuthTokens({ code }: { code: string }) {
  const url = "https://github.com/login/oauth/access_token";
  const values = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    code,
    redirect_uri: GITHUB_REDIRECT_URI,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: values.toString(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch GitHub OAuth Tokens: ${await res.text()}`);
  }

  return res.json() as Promise<{
    access_token: string;
    token_type: string;
    scope: string;
  }>;
}

export async function getGithubUser(access_token: string) {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch GitHub User: ${await res.text()}`);
  }

  const user = await res.json() as {
    id: number;
    login: string;
    name: string | null;
    email: string | null;
    avatar_url: string;
  };

  // If email is null (private), we need to fetch it separately
  if (!user.email) {
    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (emailsRes.ok) {
      const emails = await emailsRes.json() as Array<{ email: string; primary: boolean; verified: boolean }>;
      const primaryEmail = emails.find(e => e.primary && e.verified) || emails.find(e => e.verified) || emails[0];
      if (primaryEmail) {
        user.email = primaryEmail.email;
      }
    }
  }

  return user;
}

export function generateState() {
  return crypto.randomBytes(16).toString("hex");
}

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

async function upsertOAuthUser({ provider, providerId, email, name, avatarUrl }) {
  const normalizedEmail = (email || "").toLowerCase();
  const idField = provider === "google" ? "googleId" : "githubId";

  const byProviderId = await User.findOne({ [idField]: providerId });
  if (byProviderId) {
    byProviderId.provider = provider;
    if (!byProviderId.email && normalizedEmail) byProviderId.email = normalizedEmail;
    if (!byProviderId.name && name) byProviderId.name = name;
    if (!byProviderId.avatarUrl && avatarUrl) byProviderId.avatarUrl = avatarUrl;
    await byProviderId.save();
    return byProviderId;
  }

  if (normalizedEmail) {
    const byEmail = await User.findOne({ email: normalizedEmail });
    if (byEmail) {
      byEmail.provider = provider;
      byEmail[idField] = providerId;
      if (name && !byEmail.name) byEmail.name = name;
      if (avatarUrl && !byEmail.avatarUrl) byEmail.avatarUrl = avatarUrl;
      await byEmail.save();
      return byEmail;
    }
  }

  const created = await User.create({
    provider,
    [idField]: providerId,
    email: normalizedEmail || undefined,
    name: name || "",
    avatarUrl: avatarUrl || ""
  });
  return created;
}

export function configureOAuth(app) {
  const googleEnabled = Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CALLBACK_URL);
  const githubEnabled = Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET && env.GITHUB_CALLBACK_URL);

  if (googleEnabled) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          callbackURL: env.GOOGLE_CALLBACK_URL
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const providerId = profile.id;
            const email = profile.emails?.[0]?.value || "";
            const name = profile.displayName || "";
            const avatarUrl = profile.photos?.[0]?.value || "";

            const user = await upsertOAuthUser({ provider: "google", providerId, email, name, avatarUrl });
            return done(null, user);
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }

  if (githubEnabled) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: env.GITHUB_CLIENT_ID,
          clientSecret: env.GITHUB_CLIENT_SECRET,
          callbackURL: env.GITHUB_CALLBACK_URL
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const providerId = profile.id;
            const email = profile.emails?.[0]?.value || "";
            const name = profile.displayName || profile.username || "";
            const avatarUrl = profile.photos?.[0]?.value || "";

            const user = await upsertOAuthUser({ provider: "github", providerId, email, name, avatarUrl });
            return done(null, user);
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }

  app.use(passport.initialize());
}

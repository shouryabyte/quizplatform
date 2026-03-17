import jwt from "jsonwebtoken";

export function signAccessToken({ userId }, { secret, expiresIn }) {
  return jwt.sign({ sub: userId }, secret, { expiresIn });
}

export function verifyAccessToken(token, { secret }) {
  return jwt.verify(token, secret);
}


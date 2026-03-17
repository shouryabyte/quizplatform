import bcrypt from "bcryptjs";

export async function hashPassword(plainText) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plainText, salt);
}

export function verifyPassword(plainText, passwordHash) {
  return bcrypt.compare(plainText, passwordHash);
}


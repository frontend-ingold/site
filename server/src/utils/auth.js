import crypto from "crypto";

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

export async function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  const derivedKey = await scrypt(password, salt);
  return `${salt}:${derivedKey}`;
}

export async function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(":");

  if (!salt || !hash) {
    return false;
  }

  const derivedKey = await scrypt(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derivedKey, "hex"));
}

export function generateAuthToken() {
  return crypto.randomBytes(32).toString("hex");
}

function scrypt(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey.toString("hex"));
    });
  });
}

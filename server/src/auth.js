import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is required.');
  }

  return jwtSecret;
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    getJwtSecret(),
    { expiresIn: '7d' },
  );
}

export function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export function extractBearerToken(header = '') {
  if (!header.startsWith('Bearer ')) {
    return '';
  }

  return header.slice(7);
}

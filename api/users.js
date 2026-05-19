import { applyCors } from './cors.js';
import { loginUser, getUserPasswordHint, registerUser, updateUserProfile } from './repository.js';

export default async function handler(request, response) {
  applyCors(request, response);

  if (request.method === 'OPTIONS') {
    response.status(204).end();
    return;
  }

  try {
    if (request.method === 'POST') {
      const { action } = request.query;

      if (action === 'register') {
        const user = await registerUser(request.body);
        if (!user) {
          response.status(409).json({ error: 'An account with this email already exists.' });
          return;
        }

        response.status(201).json(user);
        return;
      }

      if (action === 'login') {
        const user = await loginUser(request.body);
        if (!user) {
          response.status(401).json({ error: 'Invalid email or password.' });
          return;
        }

        response.status(200).json(user);
        return;
      }

      if (action === 'forgot') {
        const passwordHint = await getUserPasswordHint(request.body.email ?? '');
        if (!passwordHint) {
          response.status(404).json({ error: 'No account found with that email.' });
          return;
        }

        response.status(200).json({ passwordHint });
        return;
      }
    }

    if (request.method === 'PATCH') {
      const updatedUser = await updateUserProfile(request.body);
      if (!updatedUser) {
        response.status(404).json({ error: 'User not found.' });
        return;
      }

      response.status(200).json(updatedUser);
      return;
    }

    response.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    console.error('Users API failed:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
}

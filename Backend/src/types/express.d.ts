import type { AuthPayload } from './auth.types.js';

// Extiende Request de Express para que requireAuth pueda inyectar req.user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export {};

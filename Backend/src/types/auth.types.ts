import type { JwtPayload } from 'jsonwebtoken';
import type { User, UserRole } from '../generated/prisma/index.js';

// Usuario tal como se expone fuera del servicio: nunca incluye el hash del password
export type PublicUser = Omit<User, 'password'>;

// Carga útil del JWT una vez verificado
export interface AuthPayload extends JwtPayload {
  userId: string;
  role: UserRole;
}

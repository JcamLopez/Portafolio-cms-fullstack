import type { JwtPayload } from 'jsonwebtoken';
import type { User, UserRole } from '@prisma/client';
export type PublicUser = Omit<User, 'password'>;
export interface AuthPayload extends JwtPayload {
    userId: string;
    role: UserRole;
}
//# sourceMappingURL=auth.types.d.ts.map
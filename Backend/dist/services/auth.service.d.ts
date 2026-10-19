import type { LoginInput, RegisterInput } from '../schemas/auth.schema.js';
import type { AuthPayload, PublicUser } from '../types/auth.types.js';
export declare class EmailAlreadyExistsError extends Error {
    constructor();
}
export declare class InvalidCredentialsError extends Error {
    constructor();
}
/**
 * Registra un usuario con el password hasheado. Lanza EmailAlreadyExistsError
 * si el email ya existe. Nunca devuelve el campo password.
 */
export declare const registerUser: (data: RegisterInput) => Promise<PublicUser>;
/**
 * Valida las credenciales y devuelve un JWT firmado con { userId, role }.
 * Lanza InvalidCredentialsError sin indicar si falló el email o el password.
 */
export declare const loginUser: ({ email, password }: LoginInput) => Promise<{
    token: string;
    user: PublicUser;
}>;
/**
 * Verifica firma, algoritmo, emisor y expiración del token.
 * Lanza un error si el token no es válido.
 */
export declare const verifyAccessToken: (token: string) => AuthPayload;
//# sourceMappingURL=auth.service.d.ts.map
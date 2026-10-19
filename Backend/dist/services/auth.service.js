import bcrypt from 'bcryptjs';
import jwt, {} from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Prisma, PrismaClient, UserRole } from '@prisma/client';
const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
// Algoritmo fijo: al verificar solo se acepta este (evita ataques de "alg confusion" / "none")
const JWT_ALGORITHM = 'HS256';
const JWT_ISSUER = 'portafolio-cms';
// Hash señuelo: se compara contra él cuando el email no existe, para que el tiempo
// de respuesta sea el mismo y no revele qué correos están registrados (user enumeration)
const DUMMY_HASH = bcrypt.hashSync('dummy-password-timing-guard', SALT_ROUNDS);
// Errores de dominio: el controlador los traduce a códigos HTTP
export class EmailAlreadyExistsError extends Error {
    constructor() {
        super('El email ya está registrado');
        this.name = 'EmailAlreadyExistsError';
    }
}
export class InvalidCredentialsError extends Error {
    constructor() {
        super('Credenciales inválidas');
        this.name = 'InvalidCredentialsError';
    }
}
const isUniqueConstraintError = (error) => error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
/**
 * Registra un usuario con el password hasheado. Lanza EmailAlreadyExistsError
 * si el email ya existe. Nunca devuelve el campo password.
 */
export const registerUser = async (data) => {
    const existing = await prisma.user.findUnique({ where: { email: data.email }, select: { id: true } });
    if (existing)
        throw new EmailAlreadyExistsError();
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    try {
        return await prisma.user.create({
            data: { email: data.email, password: hashedPassword, name: data.name ?? null },
            omit: { password: true },
        });
    }
    catch (error) {
        // dos registros simultáneos con el mismo email: la restricción UNIQUE de la BD decide
        if (isUniqueConstraintError(error))
            throw new EmailAlreadyExistsError();
        throw error;
    }
};
/**
 * Valida las credenciales y devuelve un JWT firmado con { userId, role }.
 * Lanza InvalidCredentialsError sin indicar si falló el email o el password.
 */
export const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    // bcrypt.compare se ejecuta siempre (contra el hash señuelo si el usuario no existe)
    const passwordMatches = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);
    if (!user || !passwordMatches)
        throw new InvalidCredentialsError();
    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, env.JWT_SECRET, {
        algorithm: JWT_ALGORITHM,
        expiresIn: env.JWT_EXPIRES_IN,
        issuer: JWT_ISSUER,
        subject: user.id,
    });
    const { password: _password, ...publicUser } = user;
    return { token, user: publicUser };
};
/**
 * Verifica firma, algoritmo, emisor y expiración del token.
 * Lanza un error si el token no es válido.
 */
export const verifyAccessToken = (token) => {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
        algorithms: [JWT_ALGORITHM],
        issuer: JWT_ISSUER,
    });
    const validRoles = Object.values(UserRole);
    if (typeof decoded === 'string' || typeof decoded.userId !== 'string' || !validRoles.includes(decoded.role)) {
        throw new jwt.JsonWebTokenError('Carga útil del token inválida');
    }
    return decoded;
};
//# sourceMappingURL=auth.service.js.map
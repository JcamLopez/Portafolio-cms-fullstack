import { env } from '../config/env.js';
import * as authService from '../services/auth.service.js';
import { sendError, sendSuccess } from '../utils/response.handler.js';
export const register = async (req, res) => {
    try {
        // req.body ya fue validado y normalizado por validateSchema(registerSchema)
        const user = await authService.registerUser(req.body);
        return sendSuccess(res, user, 201, 'Usuario registrado correctamente');
    }
    catch (error) {
        if (error instanceof authService.EmailAlreadyExistsError) {
            return sendError(res, error.message, 409);
        }
        console.error('Error al registrar el usuario:', error);
        return sendError(res, 'Error interno al registrar el usuario');
    }
};
export const login = async (req, res) => {
    try {
        // req.body ya fue validado y normalizado por validateSchema(loginSchema)
        const { token, user } = await authService.loginUser(req.body);
        return sendSuccess(res, { token, tokenType: 'Bearer', expiresIn: env.JWT_EXPIRES_IN, user }, 200, 'Inicio de sesión exitoso');
    }
    catch (error) {
        if (error instanceof authService.InvalidCredentialsError) {
            // mensaje genérico: no revela si falló el email o el password
            return sendError(res, error.message, 401);
        }
        console.error('Error al iniciar sesión:', error);
        return sendError(res, 'Error interno al iniciar sesión');
    }
};
//# sourceMappingURL=auth.controller.js.map
/**
 * Envía una respuesta de éxito con el formato { success: true, data }.
 */
export const sendSuccess = (res, data, statusCode = 200, message) => {
    const body = { success: true, data };
    if (message)
        body.message = message;
    return res.status(statusCode).json(body);
};
/**
 * Envía una respuesta de error con el formato { success: false, message }.
 */
export const sendError = (res, message, statusCode = 500) => {
    const body = { success: false, message };
    return res.status(statusCode).json(body);
};
//# sourceMappingURL=response.handler.js.map
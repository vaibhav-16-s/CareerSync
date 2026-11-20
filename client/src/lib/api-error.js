/** Normalize any thrown value (Axios error, Error, unknown) into a usable shape. */
export function normalizeError(error) {
    const axiosErr = error;
    if (axiosErr?.isAxiosError) {
        const body = axiosErr.response?.data;
        if (body && typeof body === 'object' && 'error' in body && body.error) {
            const details = Array.isArray(body.error.details)
                ? body.error.details
                : undefined;
            // Field-validation errors (Zod) carry the generic "Invalid request
            // data" as the top-level message — the actionable reason lives in
            // `details`. Surface that instead so the user knows what to fix.
            const message = details && details.length > 0
                ? details.map((d) => d.message).join(', ')
                : body.error.message || 'Something went wrong';
            return {
                code: body.error.code || 'INTERNAL',
                message,
                status: axiosErr.response?.status,
                details,
            };
        }
        if (axiosErr.code === 'ERR_NETWORK') {
            return {
                code: 'NETWORK',
                message: 'Cannot reach the server. Check your connection.',
                status: 0,
            };
        }
        return {
            code: 'INTERNAL',
            message: axiosErr.message || 'Request failed',
            status: axiosErr.response?.status,
        };
    }
    if (error instanceof Error) {
        return { code: 'INTERNAL', message: error.message };
    }
    return { code: 'INTERNAL', message: 'Unexpected error' };
}
export function getErrorMessage(error) {
    return normalizeError(error).message;
}

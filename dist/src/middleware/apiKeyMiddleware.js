import { ForbiddenError } from '../utils/errors.js';
const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (!apiKey || apiKey !== process.env.API_KEY) {
        throw new ForbiddenError();
    }
    next();
};
export default apiKeyMiddleware;

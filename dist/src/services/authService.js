import User from '../models/user';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import RefreshToken from '../models/refreshToken';
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const REFRESH_EXPIRATION_DAYS = Number(process.env.REFRESH_EXPIRATION_DAYS);
class AuthService {
    async register(name, email, password) {
        const existsUser = await User.findOne({ where: { email } });
        if (existsUser) {
            throw new BadRequestError('Пользователь с таким email уже существует');
        }
        await User.create({ name, email, password });
    }
    async login(email, password) {
        const existsUser = await User.findOne({ where: { email } });
        if (!existsUser) {
            throw new UnauthorizedError('Неверный email или пароль');
        }
        const isPasswordValid = await bcrypt.compare(password, existsUser.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Неверный email или пароль');
        }
        const accessToken = jwt.sign({ id: existsUser.id, email: existsUser.email, name: existsUser.name }, JWT_SECRET, { expiresIn: '1h' });
        const newRefreshToken = jwt.sign({ id: existsUser.id }, REFRESH_SECRET, {
            expiresIn: `${REFRESH_EXPIRATION_DAYS}d`,
        });
        await RefreshToken.create({
            userId: existsUser.id,
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + REFRESH_EXPIRATION_DAYS * 24 * 60 * 60 * 1000),
        });
        return { accessToken, refreshToken: newRefreshToken };
    }
    async refreshToken(refreshToken) {
        const oldRefreshToken = await RefreshToken.findOne({
            where: { token: refreshToken },
        });
        if (!oldRefreshToken) {
            throw new BadRequestError('Недействительный refresh token');
        }
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        const newAccessToken = jwt.sign({ id: decoded.id }, JWT_SECRET, {
            expiresIn: '1h',
        });
        const newRefreshToken = jwt.sign({ id: decoded.id }, REFRESH_SECRET, {
            expiresIn: `${REFRESH_EXPIRATION_DAYS}d`,
        });
        await oldRefreshToken.destroy();
        await RefreshToken.create({
            userId: decoded.id,
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + REFRESH_EXPIRATION_DAYS * 24 * 60 * 60 * 1000),
        });
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
}
export default new AuthService();

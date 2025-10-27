import User from '../models/user.js';
import { BadRequestError } from '@utils/errors.js';
class UserService {
    async createUser(name, email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestError('Пользователь с таким email уже существует');
        }
        return await User.create({ name, email });
    }
    async getAllUsers() {
        return User.findAll();
    }
}
export default new UserService();

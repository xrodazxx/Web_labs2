import asyncHandler from '../middleware/asyncHandler.js';
import UserService from '../services/userService.js';
class UserController {
    getAllUsers = asyncHandler(async (req, res) => {
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    });
    createUser = asyncHandler(async (req, res) => {
        console.log(req.body);
        const { name, email } = req.body;
        if (!name || !email) {
            return res
                .status(400)
                .json({ message: 'Имя и email обязательны для заполнения' });
        }
        const user = await UserService.createUser(name, email);
        res.status(201).json(user);
    });
}
export default new UserController();

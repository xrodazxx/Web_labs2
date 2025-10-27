import { Router } from 'express';
import UserController from '../controllers/userController.js';
const router = Router();
router.post('/', UserController.createUser);
router.get('/', UserController.getAllUsers);
export default router;

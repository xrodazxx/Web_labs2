import { Router } from 'express';
import AuthController from '../controllers/authController.js';
const router = Router();
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refreshToken);
export default router;

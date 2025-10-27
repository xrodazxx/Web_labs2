import { Router } from 'express';
import EventController from '../controllers/eventController.js';
const router = Router();
router.get('/events', EventController.getAllEvents);
export default router;

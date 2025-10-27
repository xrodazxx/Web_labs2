import eventService from '../services/eventService';
import asyncHandler from '../middleware/asyncHandler';
import { BadRequestError } from '../utils/errors';
import { validate as isUUID } from 'uuid';
class EventController {
    getAllEvents = asyncHandler(async (req, res) => {
        const events = await eventService.getAllEvents();
        res.status(200).json(events);
    });
    getEventById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        if (!isUUID(id)) {
            throw new BadRequestError('Некорректный ID');
        }
        const event = await eventService.getEventById(id);
        res.status(200).json(event);
    });
    createEvent = asyncHandler(async (req, res) => {
        const { title, date, location, createdBy } = req.body;
        if (!title || !date || !createdBy || !location) {
            throw new BadRequestError('Все обязательные поля должны быть заполнены');
        }
        if (!isUUID(createdBy)) {
            throw new BadRequestError('Некорректный UUID пользователя');
        }
        const event = await eventService.createEvent(req.body);
        res.status(201).json(event);
    });
    updateEvent = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const eventData = req.body;
        if (!isUUID(id)) {
            throw new BadRequestError('Некорректный ID');
        }
        const updatedEvent = await eventService.updateEvent(id, eventData);
        res.status(200).json(updatedEvent);
    });
    deleteEvent = asyncHandler(async (req, res) => {
        const { id } = req.params;
        if (!isUUID(id)) {
            throw new BadRequestError('Некорректный ID');
        }
        const response = await eventService.deleteEvent(id);
        res.status(200).json(response);
    });
}
export default new EventController();

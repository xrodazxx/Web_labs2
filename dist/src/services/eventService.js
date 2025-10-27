import User from '../models/user';
import Event from '../models/event';
import { NotFoundError } from '../utils/errors';
class EventService {
    async createEvent(eventData) {
        const { createdBy } = eventData;
        const user = await User.findByPk(createdBy);
        if (!user) {
            throw new NotFoundError('Пользователь не найден');
        }
        return await Event.create(eventData);
    }
    async getAllEvents() {
        return await Event.findAll();
    }
    async getEventById(id) {
        return await Event.findByPk(id);
    }
    async updateEvent(id, eventData) {
        const event = await Event.findByPk(id);
        if (!event) {
            throw new NotFoundError('Мероприятие не найдено');
        }
        if (eventData.createdBy) {
            const userExists = await User.findByPk(eventData.createdBy);
            if (!userExists) {
                throw new NotFoundError('Пользователь не найден');
            }
        }
        return await event.update(eventData);
    }
    async deleteEvent(id) {
        const event = await Event.findByPk(id);
        if (!event) {
            throw new NotFoundError('Мероприятие не найдено');
        }
        await event.destroy();
        return { message: 'Мероприятие удалено' };
    }
}
export default new EventService();

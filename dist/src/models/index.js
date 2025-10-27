import Event from './event.js';
import User from './user.js';
Event.belongsTo(User, { foreignKey: 'createdBy', as: 'user' });
User.hasMany(Event, { foreignKey: 'createdBy', as: 'event' });

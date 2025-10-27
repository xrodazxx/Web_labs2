import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/db';
import { hash } from 'bcryptjs';
class User extends Model {
    id;
    name;
    email;
    password;
    createdAt;
    updatedAt;
}
User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'user',
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            user.password = await hash(user.password, 10);
        },
    },
});
export default User;

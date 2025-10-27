import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/db';
class RefreshToken extends Model {
    id;
    userId;
    token;
    expiresAt;
    createdAt;
    updatedAt;
}
RefreshToken.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'refreshToken',
    timestamps: true,
});
export default RefreshToken;

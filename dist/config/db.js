import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres',
    port: parseInt(DB_PORT, 10),
    logging: false,
});
const testConnectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
export { testConnectDB, sequelize };

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnectDB, sequelize } from '../config/db.js';
import routes from './routes/index.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import swaggerUi from 'swagger-ui-express';
import morganLogger from './middleware/morganLogger.js';
import passport from '../config/passport.js';
dotenv.config();
const app = express();
const swaggerDocument = load(readFileSync('../deployment/swagger.yaml', 'utf8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(cors());
app.use(morganLogger);
//app.use(apiKeyMiddleware);
app.use('/api', routes);
app.use(errorMiddleware);
app.use(passport.initialize());
const PORT = process.env.PORT || 5000;
app.use((req, res) => {
    res.status(404).json({ message: 'Неправильный путь' });
});
const startServer = async () => {
    try {
        await testConnectDB();
        await sequelize.sync({ alter: true });
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error starting the server:', error.message);
        }
        else {
            console.error('Unexpected error:', error);
        }
    }
};
startServer();

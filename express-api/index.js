import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import db from './config/database.js';
import router from './routes/api.js';

dotenv.config();
const app = express();


const connectToDatabase = async () => {
    try {
        await db.authenticate();
        console.log('Database Connected...');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

connectToDatabase();

const allowedOrigins = [
    'http://localhost:3000',
    'http://nutrismart-api.aaf-tech.my.id',
    'https://nutrismart-api.aaf-tech.my.id',
    'http://nutrismart-meal-app.aaf-tech.my.id/',
    'https://nutrismart-meal-app.aaf-tech.my.id/',
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// ✅ Simple health check route
app.get('/', (req, res) => {
    res.send('NutriSmart API is running!');
});

app.use(router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

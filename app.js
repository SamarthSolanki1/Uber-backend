import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectToDb from './db/db.js';
import userRoutes from './routes/user.routes.js'
import captainRoutes from './routes/captain.routes.js'
import cookieParser from 'cookie-parser'
const app  = express();
app.use(cors({
    origin: 'http://localhost:5173', // Change this to match your frontend URL
    credentials: true
}));

connectToDb();
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser());



app.get('/',(req,res) => {
    res.send('Hello World');
    console.log(req);
})
app.use('/user',userRoutes);
app.use('/captains',captainRoutes);

export default app;
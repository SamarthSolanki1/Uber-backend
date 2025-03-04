import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectToDb from './db/db.js';
import userRoutes from './routes/user.routes.js'
import captainRoutes from './routes/captain.routes.js'
import mapRoutes from './routes/maps.routes.js'
import cookieParser from 'cookie-parser'
import rideRoutes from './routes/rides.routes.js'
const app  = express();
app.use(cors({
    origin: ['http://localhost:5173', 'https://pkmms9lk-5173.inc1.devtunnels.ms'], // Allow multiple origins
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
app.use('/maps',mapRoutes)
app.use('/rides',rideRoutes)

export default app;
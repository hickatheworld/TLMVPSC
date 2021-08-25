import express, { Request, Response } from 'express';
import db from './db';
import adminsRoutes from './routes/admins';
import questionsRoutes from './routes/questions';
require('dotenv').config();

const server = express();
server.use(express.json());

server.use('/admins', adminsRoutes);
server.use('/questions', questionsRoutes);

db.connect(process.env.MONGO_URI).then(() => {
	server.listen(process.env.PORT, () => console.log(`API Server listening on :${process.env.PORT}`));
});
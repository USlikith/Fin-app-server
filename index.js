// index.js
import express from 'express';
import bodyParser from 'body-parser';
const { json } = bodyParser;
import userRoutes from './routes/userRoutes.js';

const app = express();
const port = 3000;

// Middleware
app.use(json());

// Use the routes from userRoutes
app.use('/api', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

//hellow this is madhu tral 2
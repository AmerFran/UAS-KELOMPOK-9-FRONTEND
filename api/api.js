import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import usersRoute from './routes/usersRoute.js';
import foodsRoute from './routes/foodsRoute.js';
import cartsRoute from './routes/cartsRoute.js';
import transactionsRoute from './routes/transactionsRoute.js';
import messagesRoute from './routes/messagesRoute.js';



const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json())

app.use(usersRoute);
app.use(foodsRoute);
app.use(cartsRoute);
app.use(transactionsRoute);
app.use(messagesRoute);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

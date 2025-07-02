const dotenv = require ('dotenv');
dotenv.config();
const express = require ('express');
const app = express();
const cors = require('cors');
const connectDb = require('./database/Database');
const userRoutes = require('./routes/UserRoutes');
const cookieParser = require('cookie-parser');
const captainRoutes = require('./routes/CaptainRoutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


connectDb();

app.get('/', (req, res) => {
   res.send('Hello World');
});

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);

module.exports = app;

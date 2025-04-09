const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./configs/database');

dotenv.config();
const app = express();
const PORT = 3000 | process.env.PORT
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

connectDB().then(() => {
    console.log('Database Connected Successfully!');
    app.listen(PORT, () => {
        console.log(`App is Listening on PORT ${PORT}`);
    })
}).catch((err) => {
    console.log('Error While Connecting to Database', err)
})
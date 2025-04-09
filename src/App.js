const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./configs/database');
const authRouter = require('./routes/authRouter');
const profileRouter = require('./routes/profileRouter');
const jobRouter = require('./routes/jobRouter');

const app = express();
dotenv.config();
const PORT = 3000 | process.env.PORT;
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/job', jobRouter);

connectDB().then(() => {
    console.log('Database Connected Successfully!');
    app.listen(PORT, () => {
        console.log(`App is Listening on PORT ${PORT}`);
    })
}).catch((err) => {
    console.log('Error While Connecting to Database', err)
})
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { dbConnect } = require('./config/dbConnect')


app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));


app.use(bodyParser.json());
app.use(cookieParser());
app.use("/uploads", express.static("./uploads"));



// import router
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/Dashborad/categoryRouter'));
app.use('/api', require('./routes/Dashborad/productRoute'));
app.use('/api', require('./routes/Dashborad/cartRouter'));



const port = process.env.PORT;
dbConnect();
app.listen(port, () => console.log(`Server is running on port ${port}!`));

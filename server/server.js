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
app.use('/api', require('./routes/Dashborad/invoiceRouter'));



const port = process.env.PORT;
dbConnect();
app.listen(port, () => console.log(`Server is running on port ${port}!`));



/* PORT=8000
DB_URL='mongodb://localhost:27017/posApplication'
SECRET = santobiswas
COOKIE_EXP = 7
USER_EMAIL  = 'santobiswas0011@gmail.com'
USER_PASSWORD  = 'santosantosanto'
TOKEN_EXP  = '7d'

cloud_name = dfv1bunei
api_key = 347556769576843
api_secret = _mOWawr4AQ7G_VfByU9q51ApvAY
 */
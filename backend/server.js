require('dotenv').config();
const dotenv = require('dotenv');
const cors = require("cors");
const path = require('path');
const connectDB = require('./config/db'); // Path to your DB connection
//const createAdmin = require('./utils/createAdmin');

// Load the correct .env file based on environment
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: path.resolve(__dirname, '.env.production') });
  } else {
    dotenv.config({ path: path.resolve(__dirname, '.env') });
  }

const express = require('express');
const app = express();
  

const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');
const productRouter = require('./routes/productRoutes');
const checkoutRouter = require('./routes/checkoutRoutes');
const paymentRouter = require('./routes/paymentRoutes');

const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const flash = require('connect-flash');

app.use(bodyParser.json());
app.use(cors({ 
    origin: "https://ecommerce-qmn0gp91q-nofil-abdul-hafeezs-projects.vercel.app/", // Your frontend URL
    credentials: true // Allow cookies
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET || 'defaultSecret'
    })
);
app.use(flash());


app.use("/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/product", productRouter);
app.use("/api/payment", paymentRouter)


// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

connectDB();
//createAdmin();


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

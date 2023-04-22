const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to Database
connectDB();

// Route files
const campbookings = require('./routes/campbookings');
const auth = require('./routes/auth');
const appointments = require('./routes/appointments');
const buses = require('./routes/buses');
const busappointments = require('./routes/busappointments');

const { mongo } = require('mongoose');

const app = express();

// Add Cookie parser
app.use(cookieParser());

// Body parser
app.use(express.json());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate Limiting
const limiter = rateLimit({
  windowsMs: 10*60*1000,//10 mins
  max: 100
});
app.use(limiter);

//Prevent http param pollutions
app.use(hpp());

//Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/campbookings', campbookings);
app.use('/api/v1/auth', auth);
app.use('/api/v1/appointments', appointments);
app.use('/api/v1/buses', buses);
app.use('/api/v1/busappointments', busappointments);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

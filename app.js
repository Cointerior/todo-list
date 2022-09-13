require('dotenv').config();
const express = require('express');
//const createError = require('http-errors');
const morgan = require('morgan');
const mongoose = require("mongoose")
const cors = require("cors")
const connectDB = require("./db/dbconn")
const xss = require("xss-clean")
require("express-async-errors")
const rateLimiter = require("express-rate-limit")
const helmet = require("helmet")
const errorHandler = require("./error/errorhandler")
const cookieParser = require("cookie-parser")
const verifyJwt = require("./middleware/verifyJwt")

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

connectDB()
app.use(cookieParser())

app.set('trust proxy', 1)

app.use(rateLimiter(
  {
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}
))
app.use(cors())
app.use(xss())
app.use(helmet())

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

//app.use('/api', require('./routes/api.route'));

app.use("/task", verifyJwt, require("./routes/task"))
app.use("/refresh", require("./routes/refresh"))
app.use("/user", require("./routes/user"))

/*app.use((req, res, next) => {
  next(createError.NotFound());
}); */

/*app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
}); */

//app.use(errorHandler)

const PORT = process.env.PORT || 3000;

mongoose.connection.once("open", () => {
  console.log("connected to db")
  app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
})


/*const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`)); */

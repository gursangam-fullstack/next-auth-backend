require("dotenv").config();
const express = require('express')
const cors = require('cors');
const cookieParser = require("cookie-parser");
const { connectDb } = require("./config/db");
const mongoSanitize = require("express-mongo-sanitize");
const passport = require('passport');
const userRouter = require("./routes/userRoutes");
require('./config/passport-jwt-strategy')

const { refreshTokenEndpoint, autoRefreshMiddleware } = require('./utils/authUtils');
const app = express();

const port = process.env.port
const DATABASE_URL = process.env.MONGO_URL

const allowedOrigins = process.env.FRONTEND_HOST

// const corsOptions = {
//     origin: (origin, callback) => {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     credentials: true
// }

// app.use(cors(corsOptions));

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true               
}));

// app.use(autoRefreshMiddleware);
//app.post('/api/refresh-token', refreshTokenEndpoint);



connectDb(DATABASE_URL)
app.use(express.json())
app.use(passport.initialize())
app.use(cookieParser())

app.use((req, res, next) => {
    if (req.body) {
        mongoSanitize.sanitize(req.body, {
            replaceWith: "_",
            onSanitize: ({ key }) => {
                console.warn(`Sanitized key from body: ${key}`);
            },
        });
    }
    next();
});

app.use("/api/user", userRouter)

app.listen(port, () => {
    console.log(`server listen on port ${port}`);
})
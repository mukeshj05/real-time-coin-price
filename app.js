const express = require('express')
const cors = require('cors')
const cookieParser = require("cookie-parser")
const dotenv = require('dotenv')
const socket = require('./socket')
const router = require('./routes')
dotenv.config()

const app = express()
const port = process.env.PORT || 8000

process.on('uncaughtException', (err) => {
  console.error(`Unhandled Exception - ${err.message}`, { err: err.stack });
});

const whitelist = [/http:\/\/localhost:[0-9]{4}/]
const corsOptions = {
origin: function (origin, callback) {
    if (whitelist.some(el => origin?.match(el)) || origin === undefined) {
        callback(null, true);
    } else {
        callback(new Error("Not allowed by CORS"));
    }
},
credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router)
app.use((err, req, res, next) => {
    return res.status(500).json({
        success: false,
        message: err.message,
        data: err
    })
})

const server = app.listen(port, () => console.log(`> Server running on port ${port}`));

const io = socket.init(server)
io.on('connection', socket => {
    console.log('> Socket io connected')
})

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection - ${err.message}`, { err: err.stack });
});
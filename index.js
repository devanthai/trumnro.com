const express = require('express');
const app = express()
const WebSocket = require('ws');
var cors = require('cors')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var bodyParser = require('body-parser')
const routers = require('./routers');
const Game = require('./controller/game');
//const Keno = require('./controller/keno');
const SocketPlayer = require('./games/PlayerSocket');
var cookieSession = require('cookie-session')
var Keygrip = require('keygrip')
app.set('trust proxy', 1)

app.use(cors({
  origin: [
    'https://9sao.me/',
    'https://www.9sao.me/',
    'https://200kz.com/',
    'https://www.200kz.com/',
    'https://500kz.com/',
    'https://www.500kz.com/',
    'https://www.9sao.club/',
    'https://9sao.club/',
    'https://www.cltxnr.com/',
    'https://cltxnr.com/',
    'https://www.cltxnro.com/',
    'https://cltxnro.com/',
    'https://luachua.com/',
    'https://www.luachua.com/',
    'https://www.nrcltx.com/',
    'https://nrcltx.com/',
    'https://nroauto.com/',
    'https://www.nroauto.com/',
    'https://nrotx.com/',
    'https://www.nrotx.com/',
  ]
}));

var session = cookieSession({
  name: 'session',
  keys: new Keygrip(['key1', 'key2'], 'sha256', 'hex'),
  maxAge: 2400 * 60 * 60 * 1000,
  cookie: {
    httpOnly: true,
    secure: true
  }
})
app.use(session)
dotenv.config()
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, () => console.log('Connected to db'));
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }))
app.use(bodyParser.json({ limit: '30mb' }))
app.use(express.static('public'))
app.set("view engine", "ejs")
app.set("views", "./views")
const server = require('http').createServer(app);
//const wss = new WebSocket.Server({ server: server, path: '/wss' });

const io = require('socket.io')(server);

SocketPlayer.io(io, app);
routers(app)
io.use(function (socket, next) {
  session(socket.request, socket.request.res, next);
});
Game.server24(io)
//Keno.KenoStart()
server.listen(3000, () => console.log('Server Running on port 3000'));
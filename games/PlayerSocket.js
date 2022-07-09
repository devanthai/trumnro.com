const BauCua = require('./baucua');
const Lucky = require('./lucky');
const TaiXiu = require('./taixiu');
const ChanLe = require('./chanle');
//const BtcGame = require('./bitcoin');


var isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);
var SocketPlayer = []
io = (io, app) => {
   
    io.on('connection', client => {
        client.on('connect_failed', function() {
            console.log("Sorry, there seems to be an issue with the connection!");
         })
         client.on('connect_error', function() {
            console.log("Sorry, there seems to be an issue with the connection!");
         })
        client.on("CHAT", (message) => {
            try {
                var obj = JSON.parse(message);
                if (obj.type === "CHAT") {
                    if (obj.token && obj.name && obj.sodu && obj.noidung) {
                        var noidung = obj.noidung;
                        const sodu = obj.sodu;
                        const name = obj.name;
                        const vip = obj.vip;
                        const clan = obj.clan;
                        const top = obj.top;
                        const type = obj.typechat;
                        const token = obj.token;
                        if (!isHTML(noidung) && !isHTML(sodu) && !isHTML(name) && !isHTML(vip) && !isHTML(clan) && !isHTML(top) && !isHTML(type) && !isHTML(token)) {
                            client.broadcast.emit("CHAT", JSON.stringify(obj));
                        }
                    }
                }
            } catch { }
        })
        var clientIp = client.request.connection.remoteAddress;
        try {
            if (client.request.session.userId != undefined) {
                SocketPlayer.push({ socket: client.id, userId: client.request.session.userId, ip: clientIp, name: client.request.session.name })
            }
            client.on('disconnect', () => {
                try {
                    var len = 0;
                    for (var i = 0, len = SocketPlayer.length; i < len; ++i) {
                        var p = SocketPlayer[i];
                        if (p.socket == client.id) {
                            SocketPlayer.splice(i, 1);
                            break;
                        }
                    }
                } catch { }
            });
        } catch { }
    });
    TaiXiu.taixiu(io, app);
    ChanLe.chanle(io, app);
    BauCua.baucua(io, app);
    Lucky.gamestart(io, app)
   // BtcGame.start(io,app)
}
module.exports = { io, SocketPlayer }
exports.SocketPlayer = SocketPlayer
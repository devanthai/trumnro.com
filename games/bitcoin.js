const Binance = require('node-binance-api');
const request = require('request');
const API_KEY = '6jVcsLxzTDn6xa5cmmvxpsZ9MmGHevJhAmQxRtF6fphtA5KH8fnL0R09IZj0WBdT';
const API_SECRET = 'DCvK93LS9IYHqfpsZPxyAU0BTDK63RZRp4HOqf6foPjuMYZJP01pjqt0yPpNGv1U';
const binance = new Binance().options({
    APIKEY: API_KEY,
    APISECRET: API_SECRET
});

var Candles = []
var AmountClose = 0;
request.get('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=10', function (error, response, body) {
    var ccc = JSON.parse(body)
    ccc.forEach(d => {
        var rs = { time: d[0] / 1000, open: parseFloat(d[1]), high: parseFloat(d[2]), low: parseFloat(d[3]), close: parseFloat(d[4]) }
        Candles.push(rs)
    });
})

class GameBTC {
    start = (io, app) => {
        app.get("/getcandles", async (req, res) => {
            res.send(Candles)
        })

        app.get("/bet", async (req, res) => {
            const goldBet = 100000000;
            const amountBet = AmountClose;
            setTimeout(() => {
                
            }, 30000);
            // if (req.user.isLogin) {

            // }
            // else
            // {
            //     return res.send({})
            // }
            res.send(Candles)
        })

        binance.websockets.candlesticks(['BTCUSDT'], "1m", (candlesticks) => {
            let { e: eventType, E: eventTime, s: symbol, k: ticks } = candlesticks;
            let { t: time, o: open, h: high, l: low, c: close, v: volume, n: trades, i: interval, x: isFinal, q: quoteVolume, V: buyVolume, Q: quoteBuyVolume } = ticks;
            var Rs = { time: Math.round(time / 1000), open: parseFloat(open), high: parseFloat(high), low: parseFloat(low), close: parseFloat(close) }
            AmountClose = Rs.close
            Candles.push(Rs)
            io.sockets.emit("BTCdata", Rs)
        });
    }
}
module.exports = new GameBTC

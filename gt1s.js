const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
var shell = require('shelljs');
const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/dbgt1s", { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }, () => console.log('Connected to db'));
const express = require('express');
const app = express()
app.set('trust proxy', 1)

app.get('/getgt1s', async (req, res) => {
    const lsgd = await Gachthe1s.find({}).limit(50).sort({ time: -1 })
    res.send(lsgd)
})

const server = require('http').createServer(app);
server.listen(6488, () => console.log('Server Running on port 6488'));


const gt1s = new mongoose.Schema({
    magd: {
        type: String
    },
    sotien: {
        type: Number
    },
    timegt1s: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now
    }
})
var Gachthe1s = mongoose.model('Gachthe1s', gt1s);


var browser = null
var page = null
var cookies =null
var content = null
auto = async () => {
    try {
        browser = await puppeteer.launch({ args: ['--no-sandbox', '--single-process', '--no-zygote'], headless: false });
        page = await browser.newPage();
        if (cookies == null) {
            await page.goto('https://gachthe1s.com/account/login', { waitUntil: 'networkidle0' });
            await page.waitForTimeout(2000)
            await page.type("#phoneOrEmail", '9saovip');
            await page.type("#password", '901443');
            await page.click("button[type='submit']")
        }
        else {
            await page.setCookie(...cookies);

        }
        await page.waitForTimeout(2000)
        await page.goto('https://gachthe1s.com/wallet/transfer', { waitUntil: 'networkidle0' });
        content = await page.content()
        if (content.includes("10,000,000")) {

            cookies = await page.cookies()
            console.log(cookies)
            const $ = cheerio.load(content, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            cheerioTableparser($);
            var data = $(".col-sm-12.table-responsive").parsetable(true, true, true);
            for (var i = 1; i < data[0].length; i++) {
                var magd = data[0][i];
                var sotien = data[1][i];
                var ten = data[2][i];
                var time = data[3][i];
                var status = data[4][i];
                var noidung = data[5][i];
                sotien = Number(sotien.replace(/,/g, '').replace("đ", ''))
                if (sotien > 0) {
                    const findGt1s = await Gachthe1s.findOne({ magd: magd })
                    if (!findGt1s) {
                        await new Gachthe1s({ magd: magd, sotien: sotien, timegt1s: time }).save()
                    }
                }
                //console.log(magd + "|" + noidung + "|" + sotien)
            }
        }
        else {
            cookies = null
        }
        await page.close()
        await browser.close();
    } catch (error) {
        await page.close()
        await browser.close();
    }
    //shell.exec(`taskkill /IM "chrome.exe" /F`)

}
auto()
setInterval(async () => {
    auto()
}, 60000)


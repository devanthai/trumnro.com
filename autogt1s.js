const mongoose = require('mongoose');
const dotenv = require('dotenv');
const request = require("request")
const GT1S = require("./models/Gt1s")
dotenv.config()
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, () => console.log('Connected to db'));

setInterval(() => {
    try {
        getGt1s();

    } catch (err) {
        console.log(err)
    }
}, 5000);

getGt1s = () => {
    request.get('http://45.119.84.14:6488/getgt1s', function (error, response, body) {
        var json = JSON.parse(body);
        json.forEach(element => {
            if (element.sotien > 0) {
                GT1S.findOne({ magd: element.magd }).exec((err, data) => {
                    if (!data) {
                        new GT1S({ magd: element.magd, sotien: element.sotien, timegt1s: element.timegt1s, status: -1 }).save()
                    }
                })
            }
        });
    })
}

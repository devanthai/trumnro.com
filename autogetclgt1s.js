
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const request = require("request")
const GT1S = require("./models/Clgt1s")
const ChietKhau = require("./models/ChietKhau")
const User = require("./models/User")
const UserControl = require("./controller/user")
const Setting = require("./models/Setting")
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
    request.get('http://45.119.84.14:6999/getgt1s', async function (error, response, body) {
        var json = JSON.parse(body);
        const setting = await Setting.findOne({ setting: "setting" })

        for (let i = 0; i < json.length; i++) {
            const magd = json[i].magd
            const sotien = json[i].sotien
            const noidung = json[i].noidung
            const timegt1s = json[i].timegt1s
            const findMagd = await GT1S.findOne({ magd: magd })
            if (!findMagd) {
                var username = ""
                try {
                    username = noidung.split('_')[1]
                }
                catch {
                    username = "aaaaaaaaaaaaaaaa"
                }
                if (username != "aaaaaaaaaaaaaaaa") {
                    const tienWin = getWin(sotien, noidung, magd)
                    var status = tienWin != 0 ? 1 : 2
                    const user = await User.findOne({ username: username })
                    if (user) {
                        const chietkhau = await ChietKhau.findOne({ server: user.server })
                        const vangWin = tienWin * chietkhau.vi
                        await new GT1S({ server: user.server, magd: magd, sotien: sotien, timegt1s: timegt1s, noidung: noidung, status: status, name: username, tienthang: tienWin, vangthang: vangWin }).save()
                        if (vangWin > 0) {
                            const us = await User.findOneAndUpdate({ username: username }, { $inc: { vang: vangWin } })
                            await UserControl.sodu(user._id, "+" + numberWithCommas(vangWin), "Thắng GachThe1s")
                            const ccccc = await UserControl.upKimcuong(user._id, tienWin / setting.tile.gt1s)

                        }
                    }
                }
                else {
                    await new GT1S({ magd: magd, sotien: sotien, timegt1s: timegt1s, noidung: noidung, status: status, name: "aaaaaaaaaaaaaaaa", tienthang: -1, vangthang: -1 }).save()
                }
            }
        }
    })
}




getWin = (sotien, noidung, magd) => {
    try {
        var nd = noidung
        nd = noidung.split('_')[0]
        var tiencuoc = 0;
        var s1so = -1;
        for (let i = magd.length - 1; i >= 0; i--) {
            if (!isNaN(magd[i])) {
                s1so = Number(magd[i])
                break
            }
        }
        if (nd == "C" || nd == "L" || nd == "c" || nd == "l") {
            if ((s1so % 2 == 0 && s1so != 0 && (nd == "c" || nd == "C")) || (s1so % 2 != 0 && s1so != 9 && (nd == "l" || nd == "L"))) {
                tiencuoc = sotien * 2.3
            }
        }
        // else if (nd == "T" || nd == "X" || nd == "t" || nd == "x") {
        //     if ((s1so > 4 && s1so < 9 && (nd == "T" || nd == "t")) || (s1so > 0 && s1so < 5 && (nd == "x" || nd == "X"))) {
        //         tiencuoc = sotien * 2.3
        //     }
        // }
        else if (nd == "C2" || nd == "L2" || nd == "c2" || nd == "l2") {
            if (((nd == "C2" || nd == "c2") && s1so % 2 == 0) || ((nd == "l2" || nd == "L2") && s1so % 2 != 0)) {
                tiencuoc = sotien * 1.9
            }
        }
        else if ((nd == "N1" || nd == "n1") && (s1so == 1 || s1so == 2 || s1so == 3)) {
            tiencuoc = sotien * 3
        }
        else if ((nd == "N2" || nd == "n2") && (s1so == 4 || s1so == 5 || s1so == 6)) {
            tiencuoc = sotien * 3
        }
        else if ((nd == "N3" || nd == "n3") && (s1so == 7 || s1so == 8 || s1so == 9)) {
            tiencuoc = sotien * 3
        }
        return tiencuoc
    } catch {

        return 0
    }

}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


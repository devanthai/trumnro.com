const User = require('../models/User')
const Ipblock = require('../models/Ipblock')

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
module.exports = async function (req, res, next) {

  if (req.session && req.session.userId) {

    var iprequest = req.headers['x-forwarded-for'] || req.socket.remoteAddress

    var isLogin = false;
    var vang = 0;
    var name = "";
    var sdt = "";
    const user = await User.findOne({ _id: req.session.userId })
    if (user) {
      req.session.name = user.username
      isLogin = true;
      name = user.username;
      vang = user.vang;
      sdt = user.sdt;
      ipppUser = user.IP


      if (!req.session.pass || req.session.pass == undefined || req.session.pass == null) {
        req.session.pass = user.password
      }
      else if (req.session.pass != user.password) {
        cookie = req.cookies;
        for (var prop in cookie) {
          if (!cookie.hasOwnProperty(prop)) {
            continue;
          }
          res.cookie(prop, '', { expires: new Date(0) });
        }
        req.session = null
        req.user = { isLogin: false }
        return next();
      }

      var checkIp = await Ipblock.findOne({ ip: iprequest })

      if (checkIp) {
        return res.send("tam biet")
      }

      if (ipppUser != iprequest) {
        await User.findOneAndUpdate({ _id: req.session.userId }, { IP: iprequest })
      }
      req.user = { hanmuc: user.hanmuc, thanhtichngay: user.thanhtichngay, sdt: sdt, topup: user.topup, clan: user.clan, server: user.server, _id: user._id, name: name, avatar: user.avatar, kimcuong: user.kimcuong, vang: numberWithCommas(Math.round(vang)), isLogin: isLogin }
    }
    else {
      req.user = { isLogin: false }
    }
    return next();
  } else {
    //  return res.render("index",{page:"pages/user/dangnhap"});
    req.user = { isLogin: false }
    return next();
  }
}



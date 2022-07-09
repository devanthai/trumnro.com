const Momo = require('../models/Momo')
const Bank = require('../models/Bank')
const Tsr = require('../models/Tsr')
const The9sao = require('../models/The9sao')
const Gt1s = require('../models/Gt1s')
const Card = require('../models/Card')

var ObjectId = require('mongoose').Types.ObjectId;

async function getVip(uidz) {

  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);


  var tiencard = 0;
  var tienmomo = 0;
  var tientsr = 0;
  var tienbank = 0;
  var tiengt1s = 0;
  try {
    const sum111 = await Bank.aggregate([{
      $match: { time: { $gte: startOfToday }, uid: new ObjectId(uidz) },
    }, {
      $group: {
        _id: null,
        sotien: {
          $sum: "$sotien"
        },
      }
    }])
    if (sum111) {
      tienbank = sum111[0].sotien;
    }


  } catch { }


  try {
    const sum111 = await Momo.aggregate([{
      $match: { time: { $gte: startOfToday }, uid: new ObjectId(uidz) },
    }, {
      $group: {
        _id: null,
        sotien: {
          $sum: "$sotien"
        },
      }
    }])
    if (sum111) {
      tienmomo = sum111[0].sotien;
    }

  } catch { }
  try {
    const sum111 = await Gt1s.aggregate([{
      $match: { time: { $gte: startOfToday }, uid: new ObjectId(uidz) },
    }, {
      $group: {
        _id: null,
        sotien: {
          $sum: "$sotien"
        },
      }
    }])
    if (sum111) {
      tiengt1s = sum111[0].sotien;
    }

  } catch { }
  try {
    const sumz = await Tsr.aggregate([{
      $match: { time: { $gte: startOfToday }, uid: new ObjectId(uidz) },
    }, {
      $group: {
        _id: null,
        sotien: {
          $sum: "$sotien"
        },

      }
    }])

    if (sumz) {
      tientsr = sumz[0].sotien
    }
  } catch { }

  var tienthe9sao = 0
  try {
    const sumz = await The9sao.aggregate([{
      $match: { time: { $gte: startOfToday }, uid: new ObjectId(uidz) },
    }, {
      $group: {
        _id: null,
        sotien: {
          $sum: "$sotien"
        },

      }
    }])

    if (sumz) {
      tienthe9sao = sumz[0].sotien
    }
  } catch { }


  try {
    const sumc = await Card.aggregate([{
      $match: { time: { $gte: startOfToday }, status: 1, uid: new ObjectId(uidz) },
    }, {
      $group: {
        _id: null,
        tongcard: {
          $sum: "$menhgia"
        },
        tongreal: {
          $sum: "$amount"
        }
      }
    }])
    if (sumc) {
      tiencard = sumc[0].tongcard
    }
  } catch { }
  // console.log("Card " + tiencard + "  Momo " + tienmomo + " Tsr " + tientsr)
  // console.log(tiencard + tienmomo + tientsr)
  console.log(tienthe9sao)
  return tiencard + tienmomo + tientsr + tiengt1s + tienbank + tienthe9sao
}
module.exports = getVip
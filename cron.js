var CronJob = require('cron').CronJob;
var fs = require('fs');

console.log("Start ok");

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }
auto = () => {
    try {
        var countVongquay = {
            "4": 0,
            "5": 0,
            "6": 0
        }
        const zzz = getRndInteger(4, 6)
        countVongquay[zzz] = 1
        console.log(countVongquay)
        fs.writeFile('./config/countvongquay.json', JSON.stringify(countVongquay), 'utf8', () => {
        });
    } catch (error) {
        console.error(error);
    }
    const timeOut = getRandomIntInclusive(1800000, 2400000)
    console.log(timeOut)
    setTimeout(() => {
        auto()
    }, timeOut);
}
auto()
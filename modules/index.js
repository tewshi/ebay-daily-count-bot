const sony = require("./sony");
const microsoft = require("./microsoft");

module.exports.run = (today = false) => {
    console.log('Running daily sales bot');
    sony.getDailySales(today).finally(() => microsoft.getDailySales(today));
}
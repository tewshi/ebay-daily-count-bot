const utils = require('../utils');

/**
 * Get daily sales of Sony's PS5
 * @param {boolean} today tell the bot if it should fetch for today or yesterday
 */
const getDailySales = async (today = false) => {
    const params = {
        '_dcat': '139971',
        '_ipg': '200',
        '_nkw': 'Sony',
        '_pgn': '1',
        '_sop': '10',
        'LH_Complete': '1',
        'LH_Sold': '1',
        'Model': 'Sony%20PlayStation%205',
        'rt': 'nc',
    }

    // call the util function passing the params specific to Sony
    const {count, date} = await utils.scrap(params, today);

    // print the total to console
    console.log(`${count} PS5's sold on ${date}`);
}

module.exports = {getDailySales}
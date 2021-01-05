const utils = require('../utils');

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

    const {count, date} = await utils.scrap(params, today);

    console.log(`${count} PS5's sold on ${date}`);
}

module.exports = {getDailySales}
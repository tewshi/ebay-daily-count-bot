const utils = require('../utils');

const getDailySales = async (today = false) => {
    const params = {
        '_dcat': '139971',
        '_from': 'R40', // only xbox
        '_ipg': '200',
        '_nkw': 'Microsoft',
        '_pgn': '1',
        '_sacat': '139971',  // only xbox
        '_sop': '10',
        'LH_Complete': '1',
        'LH_Sold': '1',
        'LH_TitleDesc': '0', // only xbox
        'Model': 'Microsoft%20Xbox%20Series%20X',
        'rt': 'nc',
    }

    const {count, date} = await utils.scrap(params, today);

    console.log(`${count} XBox Series X's sold on ${date}`);
}

module.exports = {getDailySales}
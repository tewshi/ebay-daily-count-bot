const express = require('express');
const FetchBot = require('fetchbot');
const dayjs = require('dayjs');
const scheduler = require('node-schedule');

const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {

    // Or by passing a configuration opject directly
    const fetchbot = new FetchBot({
        "attached": true,
        "slowmo": 50,
        "width": 1280,
        "height": 1024,
        "trust": true
    });

    const baseUrl = 'https://www.ebay.com/sch/139971/i.html'

    const paramsSony = {
        '_dcat': '139971',
        '_ipg': '25',
        '_nkw': 'Sony',
        '_pgn': '1',
        '_sop': '10',
        'LH_Complete': '1',
        'LH_Sold': '1',
        'Model': 'Sony%20PlayStation%205',
        'rt': 'nc',
    }
    const paramsMicrosoft = {
        '_dcat': '139971',
        '_from': 'R40', // only xbox
        '_ipg': '25',
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

    const urlSony = `${baseUrl}?${new URLSearchParams(paramsSony).toString()}`;
    const urlMicrosoft = `${baseUrl}?${new URLSearchParams(paramsMicrosoft).toString()}`;

    console.log(urlSony);
    console.log(urlMicrosoft);

    // const fetchBotData = await fetchbot.runAndExit({
    //     "https://google.com": {
    //         "root": true,
    //         "type": [
    //             [
    //                 "input",
    //                 "puppeteer-fetchbot aoepeople"
    //             ],
    //             [
    //                 "input",
    //                 "\n"
    //             ]
    //         ]
    //     },
    //     "/search": {
    //         "fetch": {
    //             "div.kCrYT > a > h3 AS headlines": [],
    //             "div.kCrYT > a AS links": {
    //                 "attr": "href",
    //                 "type": []
    //             }
    //         },
    //         "waitForTimeout": [
    //             [
    //                 1000
    //             ]
    //         ]
    //     }
    // });

    const sonySalesData = await fetchbot.runAndExit({
        [urlSony]: {
            "root": true,
            "fetch": {
                "div.s-item__title--tagblock > span.s-item__title--tagblock__COMPLETED > span.POSITIVE AS dates": [],
            }
        }
    });

    console.log(sonySalesData);

    if (!sonySalesData.dates) {
        sonySalesData.dates = []
    }

    const now = dayjs();
    const year = now.year();
    const month = now.month();
    const day = now.day();

    let count = sonySalesData.dates.reduce((acc, curr) => {
        const date = dayjs(new Date(curr));
        const y = date.year();
        const m = date.month();
        const d = date.day();
        if (year === y && month === m && day === d) {
            return acc + 1;
        }

        return acc;
    }, 0);

    console.log(`${count} PS5's sold on ${now.format('MM/DD/YYYY')}`);

    // run every 12:00 am -> 00:00
    j = scheduler.scheduleJob('0 0 * * *', function(){
        console.log('Today is recognized by Rebecca Black!');
    });

    res.render('index', {title: 'Express'});
});

module.exports = router;

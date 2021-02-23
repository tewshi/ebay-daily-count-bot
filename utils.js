const FetchBot = require('fetchbot');
const dayjs = require('dayjs');

/**
 * Run the scrapper based on the given parameters
 * @param {object} params contains the query parameters for this scrap
 * @param {boolean} today tell the bot if it should fetch for today or yesterday
 */
const scrap = async (params, today) => {
    // final count
    let count;
    // date format
    const dateFormat = 'MM/DD/YYYY';
    // same base url
    const baseUrl = 'https://www.ebay.com/sch/139971/i.html'
    // form the url using the given params
    const url = `${baseUrl}?${new URLSearchParams(params).toString()}`;

    // create our fetch bot
    // wish I could run this in a headless form
    const fetchbot = new FetchBot({
        "attached": true,
        "slowmo": 50,
        "width": 1280,
        "height": 1024,
        "trust": true
    });

    // run the bot to pull data based on given params
    const salesData = await fetchbot.runAndExit({
        [url]: {
            "root": true,
            "fetch": {
                "div.s-item__title--tagblock > span.s-item__title--tagblock__COMPLETED > span.POSITIVE AS dates": [],
            }
        }
    });

    // assign the dates value to an empty array if null
    if (!salesData.dates) {
        salesData.dates = []
    }

    let now = dayjs();

    // subtract one day if we're not scrapping for today
    if (!today) {
        now = now.subtract(1, 'day');
    }

    // count all the items that was sold on now
    count = salesData.dates.reduce((acc, curr) => {
        const date = dayjs(new Date(curr));

        if (now.format(dateFormat) === date.format(dateFormat)) {
            return acc + 1;
        }

        return acc;
    }, 0);

    const page = Number(params._pgn);
    const perPage = Number(params._ipg);
    // total number of items scrapped
    const scrapped = page * perPage;

    // if total scrapped equals the count, then recursively call the function to go to next page
    if (count * page === scrapped) {
        params._pgn = (page + 1).toString();
        const {count: c} = await scrap(params, today);
        count += c;
    }

    return {count, date: now.format(dateFormat)}
}

module.exports.scrap = scrap
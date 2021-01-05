const FetchBot = require('fetchbot');
const dayjs = require('dayjs');

const scrap = async (params, today) => {
    let count;
    const dateFormat = 'MM/DD/YYYY';
    const baseUrl = 'https://www.ebay.com/sch/139971/i.html'
    const url = `${baseUrl}?${new URLSearchParams(params).toString()}`;

    const fetchbot = new FetchBot({
        "attached": true,
        "slowmo": 50,
        "width": 1280,
        "height": 1024,
        "trust": true
    });

    const salesData = await fetchbot.runAndExit({
        [url]: {
            "root": true,
            "fetch": {
                "div.s-item__title--tagblock > span.s-item__title--tagblock__COMPLETED > span.POSITIVE AS dates": [],
            }
        }
    });

    if (!salesData.dates) {
        salesData.dates = []
    }

    let now = dayjs();

    if (!today) {
        now = now.subtract(1, 'day');
    }

    count = salesData.dates.reduce((acc, curr) => {
        const date = dayjs(new Date(curr));

        if (now.format(dateFormat) === date.format(dateFormat)) {
            return acc + 1;
        }

        return acc;
    }, 0);

    const page = Number(params._pgn);
    const perPage = Number(params._ipg);
    const scrapped = page * perPage;

    if (count * page === scrapped) {
        params._pgn = (page + 1).toString();
        const {count: c} = await scrap(params, today);
        count += c;
    }

    return {count, date: now.format(dateFormat)}
}

module.exports = {scrap}
const key = "74CA9EF7-2B27-42E9-A682-D3F0FE922AB1";
const urlHead = "https://api.coingecko.com/api/v3/";
const price = "simple/price?ids=ternio&vs_currencies=usd";
const priceList = "coins/ternio/market_chart?vs_currency=usd&days=1";

// URL for getting current price
const priceURL = urlHead + price;
// URL for getting price history(over the last 24hrs)
const historyURL = urlHead + priceList;

var currentPrice;
var priceHistory = [];
var avg;
var high;
var low;
var priceArray = [];
var pricePercent;
var conclusion;
var offset;
//  Timestamp stuff
const currentDate = new Date();

//  color gradient code
function perc2color(perc) {
    var r, g, b = 0;
    if(perc < 50) {
        r = 255;
        g = Math.round(5.1 * perc);
        b = g;
    }
    else {
        g = 255;
        r = Math.round(510 - 5.1 * perc);
        b = r;
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
}

//  Function for calculating previous prices
//  Takes array of arrays from API as parameter
function priceCalc(a) {
    var total = 0;
    for(i = 0; i < a.length; i++) {
        total += a[i][1];
        priceArray.push(a[i][1]);
    }
    avg = total / (a.length);
    console.log("The average price(last 24hrs) is: ", avg);
}

//  Find the high and low price from the selected time period
function findHighLow() {
    low = priceArray.reduce(findMin);
    high = priceArray.reduce(findMax);
    console.log("Low = ", low, ", High = ", high);
}

function drawConclusion(a) {
    if (a > 50) {
        conclusion = 'above average';
        offset = a - 50 + '% ';
    } else if (a < 50) {
        conclusion = 'below average';
        offset = 50 - a + '% ';
    } else {
        conclusion = 'average';
        offset = '';
    }
}

const findMin = (acc, val) => {
    if (acc > val) {
        acc = val;
    }
    return acc;
};

const findMax = (acc, val) => {
    if (acc < val) {
        acc = val;
    }
    return acc;
};

const findPercent = () => {
    var range = high - low;
    var correctedStartValue = currentPrice.usd - low;
    var percentage = (correctedStartValue * 100) / range;
    return percentage;
}

//  Manipulation of background color 
var bgElement = document.getElementsByTagName("body")[0];
//  Fallback color, if things don't work
var bgColor = "#ffffff";
window.onload = async () => {

    // Retrieve price data from API
    await fetch(priceURL)
        .then(res => res.json())
        .then(data => currentPrice = data.ternio);

    //  Fetch price history
    await fetch(historyURL)
        .then(res => res.json())
        .then(data => priceHistory = data.prices);

    // Call function for calculating average price over time period
    priceCalc(priceHistory);
    findHighLow();
    console.log("Corrected percent: ", findPercent());
    drawConclusion(findPercent());

    // API data returned - current price
    console.log("The current price is: ", currentPrice.usd);

    // Generate summery in console
    console.log('TERN price is currently ' + offset + conclusion + ' for the last 24 hours.')

    // Set background color to reflect current price value
    document.getElementsByTagName("body")[0].style.backgroundColor = bgColor;
    bgColor = perc2color(findPercent());
    document.getElementsByTagName("body")[0].style.backgroundColor = bgColor;

    // Set refreshed timestamp on home page
    document.getElementById('time').innerHTML = currentDate;
}
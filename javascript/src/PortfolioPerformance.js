const prices = [
    { effectiveDate: new Date(2021, 8, 1, 5, 0, 0), price: 35464.53 },
    { effectiveDate: new Date(2021, 8, 2, 5, 0, 0), price: 35658.76 },
    { effectiveDate: new Date(2021, 8, 3, 5, 0, 0), price: 36080.06 },
    { effectiveDate: new Date(2021, 8, 3, 13, 0, 0), price: 37111.11 },
    { effectiveDate: new Date(2021, 8, 6, 5, 0, 0), price: 38041.47 },
    { effectiveDate: new Date(2021, 8, 7, 5, 0, 0), price: 34029.61 },
];

const transactions = [
    { effectiveDate: new Date(2021, 8, 1, 9, 0, 0), value: 0.012 },
    { effectiveDate: new Date(2021, 8, 1, 15, 0, 0), value: -0.007 },
    { effectiveDate: new Date(2021, 8, 4, 9, 0, 0), value: 0.017 },
    { effectiveDate: new Date(2021, 8, 5, 9, 0, 0), value: -0.01 },
    { effectiveDate: new Date(2021, 8, 7, 9, 0, 0), value: 0.1 },
];

export function getDailyPortfolioValues() {

    // set the date range 
    const getDaysArray = function(start, end) {
        for(var arr=[],dt=new Date(start); 
        dt<=end; 
        dt.setDate(dt.getDate()+1)){
            arr.push({effectiveDate: new Date(dt), value: 0});
        }
        return arr;
    };

    // sum all transactions per day
    const reduceValue = function(arr) {
        const total = arr.reduce((runningTotal, transaction) => {
            return runningTotal + transaction.value;
        },0)
        return total
    }
    
    // declare the date range
    const weekArray = getDaysArray(new Date("2021-09-01"),new Date("2021-09-07"))

    // daily values
    let amountOfBitcoin = 0
    let lastRecordedPrice = 0
    let dayValue = 0


    const dailyPortfolioValues = weekArray.map(day => {
        const dayPrices = prices.filter(price => price.effectiveDate.getDay() === day.effectiveDate.getDay())
        // update the last recorded price of BTC for the day if provided 
        if(dayPrices.length !== 0){
            lastRecordedPrice = dayPrices[dayPrices.length-1].price
        }
        // create a list of transactions on the day
        const dayTransactions = transactions.filter(transaction => transaction.effectiveDate.getDay() === day.effectiveDate.getDay())
        // update the amount of BTC if any transactions were made
        if (dayTransactions.length !== 0) {
            amountOfBitcoin += reduceValue(dayTransactions)   
        }
        // calculate the value of possesed BTC
        dayValue = amountOfBitcoin*lastRecordedPrice
        // update the value of possesed BTC on the day (round value for corrections)
        day.value = Math.round(dayValue*100000)/100000
        return day
        
    })

    return dailyPortfolioValues;
}

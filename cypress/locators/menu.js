
exports.beverageTypes = () => {
    return '.sc-bdnylx.kpcQYe ul'
}

exports.selectBeverage = (beverage) => {
    return `div span[id='${beverage}']~div>div:nth-of-type(1) p:nth-of-type(2)`
}

exports.beverageCost = (beverage) => {
    return `div span[id='${beverage}']~div div p:nth-of-type(1)+p+div`
}

exports.reviewAndPay = () => {
    return `p.sc-pNWxx.gimreV`
}
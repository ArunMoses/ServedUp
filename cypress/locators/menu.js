
exports.categories = () => {
    return '.sc-bdnylx.kpcQYe ul'
}

exports.selectItem = (item) => {
    return `div span[id='${item}']~div>div:nth-of-type(1) p:nth-of-type(2)`
}

exports.itemCost = (item) => {
    return `div span[id='${item}']~div div p:nth-of-type(1)+p+div`
}

exports.reviewAndPay = () => {
    return `p.sc-pNWxx.gimreV`
}
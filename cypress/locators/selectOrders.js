exports.modalOverlay = () => {
    return '.ReactModal__Content--after-open'
}

exports.selectSize = (cost) => {
    return `div.ReactModal__Overlay--after-open p:contains('${cost}'):nth-of-type(2)`
}

exports.increaseQuantity = () => {
    return 'button.sc-bkbjAj.dlagLn'
}

exports.quantity = () => {
    return 'div button~p'
}

exports.addToOrder = () => {
    return "p.sc-pNWxx.gimreV"
}
exports.cardPaymentiFrame = () => {
    return "iframe[title='Secure card payment input frame']"
}

exports.cardNumber = () => {
    return "input[name='cardnumber']"
}

exports.expiryDate = () => {
    return "input[name='exp-date']"
}

exports.cvc = () => {
    return ".InputContainer input[name='cvc']"
}

exports.cardError = () => {
    return "div.card-errors"
}

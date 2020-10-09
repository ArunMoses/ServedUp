exports.paymentSuccessHeader = () => {
    return "//p[text()='Thank you']"
}

exports.orderConfirmationName = (name) => {
    return `//p[text()='Name: ${name}']`
}

exports.orderConfirmationMobile = () => {
    return `//p[contains(text(),'Phone: ')]`
}

exports.orderConfirmationSubTotal = () => {
    return "p.sc-pNWxx.guEoZN"
}
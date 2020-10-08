exports.paymentSuccessHeader = () => {
    return "//p[text()='Thank you']"
}

exports.orderConfirmationName = (name) => {
    return `//p[text()='Name: ${name}']`
}

exports.orderConfirmationMobile = (number) => {
    return `//p[text()='Phone: +44${number}']`
}

exports.orderConfirmationSubTotal = () => {
    return "//p[text()='Subtotal:']/following::p"
}
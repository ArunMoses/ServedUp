exports.orderQuantity = () => {
    return "//p[text()='Your Order']/following::div//p"
}

exports.orderTitle = () => {
    return "//p[text()='Your Order']/following::div//p/following::div/p"
}

exports.orderTotal = () => {
    return "//p[text()='Total to pay:']/following::p"
}

exports.continueToCheckout = () => {
    return "//p[text()='Continue to Checkout']"
}
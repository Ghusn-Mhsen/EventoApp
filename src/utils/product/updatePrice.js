// Virtual field for calculating priceAfterDiscount
const updatePrice = function (product) {
    
    const currentDate = new Date();
    const validOffer = product.offers.find(offer => {

        return (
            offer.startDateOfOffers <= currentDate &&
            offer.endDateOfOffers >= currentDate && 
            offer.active
        );
    });
    if (validOffer) {

        const discountAmount = (validOffer.valueOfOffer / 100) * product.price;
        product.priceAfterOffer = product.price - discountAmount;
    }
    
    return product;
    // No valid offer found, return original price
};
module.exports = updatePrice;
const cartModel = require('../../models/cartModel');
const { responseReturn } = require('../../utiles/response');
const { mongo: { ObjectId } } = require('mongoose');



class cartController {

    // add_to_cart
    add_to_cart = async (req, res) => {
        const { userId, productId, quantity } = req.body;
        try {
            const cartProduct = await cartModel.findOne({ productId });
            if (cartProduct) {
                responseReturn(res, 404, { error: "Product already added to cart" })
            } else {
                const cartProduct = await cartModel.create({
                    productId,
                    userId,
                    quantity
                });
                responseReturn(res, 201, { message: 'Add to card success', cartProduct })
            }

        } catch (error) {
            responseReturn(res, 500, { error: "Internal server error" })
        }

    }

    // get_cart_products
    get_cart_products = async (req, res) => {
        const { userId } = req.params;
        try {

            const cart_products = await cartModel.aggregate([
                {
                    $match: {
                        userId: {
                            $eq: new ObjectId(userId)
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'products'
                    }
                }
            ]);

            let calculatePrice = 0;
            let card_product_count = 0;

            for (let i = 0; i < cart_products.length; i++) {
                const { quantity } = cart_products[i];

                card_product_count = card_product_count + quantity;
                const { price } = cart_products[i].products[0];
                calculatePrice = calculatePrice + quantity * price
            }

            responseReturn(res, 200, {
                price: calculatePrice,
                card_product_count,
                cart_products
            });

        } catch (error) {
            responseReturn(res, 500, { error: "Internal server error" })
        }
    }

    // quantity_inc
    quantity_inc = async (req, res) => {
        const { cartId } = req.params;

        try {
            const { quantity } = await cartModel.findById(cartId);

            await cartModel.findByIdAndUpdate(cartId, {
                quantity: quantity + 1
            }, { new: true })

            responseReturn(res, 200, { message: "Added to cart" })

        } catch (error) {
            responseReturn(res, 500, { error: "Internal server error" })
        }
    }


    // quantity_dec
    quantity_dec = async (req, res) => {
        const { cartId } = req.params;

        try {
            const { quantity } = await cartModel.findById(cartId);

            await cartModel.findByIdAndUpdate(cartId, {
                quantity: quantity - 1
            }, { new: true })

            responseReturn(res, 200, { message: "Remove form cart" })

        } catch (error) {
            responseReturn(res, 500, { error: "Internal server error" })
        }
    }


    // remove_form_cart
    remove_form_cart = async (req, res) => {
        const { cartId } = req.params;
        try {
            await cartModel.findByIdAndDelete(cartId);
            responseReturn(res, 200, { message: 'Product remove form cart' })
        } catch (error) {
            responseReturn(res, 500, { error: "Internal server error" })
        }
    }

}


module.exports = new cartController();
const { responseReturn } = require('../../utiles/response');
const productModel = require('../../models/productModel');



class productController {

    // add_product
    add_product = async (req, res) => {
        const { adminId } = req;
        const { product, price, category } = req.body;
        const productImage = req.file.filename;
        try {
            if (!product || !price || !category || !productImage) {
                responseReturn(res, 400, { error: "All field is required !" })
            } else {
                await productModel.create({
                    adminId,
                    product,
                    price,
                    category,
                    productImage
                });
                responseReturn(res, 200, { message: "Product successfully added" })
            }

        } catch (error) {
            responseReturn(res, 500, { error: "Internal server error" })
        }
    }

}


module.exports = new productController();
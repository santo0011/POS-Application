const { responseReturn } = require('../../utiles/response');
const productModel = require('../../models/productModel');
const { productImgMoveFunc } = require('../../utiles/imageFile');



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
                productImgMoveFunc()
                responseReturn(res, 200, { message: "Product successfully added" })
            }

        } catch (error) {
            responseReturn(res, 500, { error: "Internal server error" })
        }
    }


    // get_products
    get_products = async (req, res) => {
        const { adminId } = req;
        const { searchValue, page, parPage } = req.query;
        const skipPage = parseInt(parPage) * (parseInt(page) - 1);

        try {
            if (searchValue) {
                const products = await productModel.find({
                    adminId: adminId,
                    $or: [
                        { product: { $regex: searchValue, $options: 'i' } },
                        {
                            $expr: {
                                $regexMatch: {
                                    input: { $toString: "$price" },
                                    regex: searchValue,
                                    options: "i"
                                }
                            }
                        },
                    ]
                }).sort({ createdAt: -1 });

                const productCount = await productModel.find({ adminId }).countDocuments();

                responseReturn(res, 200, {
                    allProduct: products,
                    productCount
                })

            } else {
                const products = await productModel.find({ adminId }).skip(skipPage).limit(parPage).sort({ createdAt: -1 });
                const productCount = await productModel.find({ adminId }).countDocuments();
                responseReturn(res, 200, {
                    allProduct: products,
                    productCount
                })
            }

        } catch (error) {
            console.log(error.message)
        }
    }

}


module.exports = new productController();
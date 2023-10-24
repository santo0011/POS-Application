const { responseReturn } = require('../../utiles/response');
const productModel = require('../../models/productModel');
const cartModel = require('../../models/cartModel');
const { productImgMoveFunc, productDeleteFunction } = require('../../utiles/imageFile');



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
        const { searchValue, page, parPage, findCate } = req.query;
        const skipPage = parseInt(parPage) * (parseInt(page) - 1);

        try {
            if (searchValue) {
                const products = await productModel.find({
                    adminId: adminId,
                    $or: [
                        { product: { $regex: searchValue, $options: 'i' } },
                        { category: { $regex: searchValue, $options: 'i' } },
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
                let products = [];
                if (findCate) {
                    products = await productModel.aggregate([
                        { $match: { adminId, category: findCate } },
                        { $sort: { createdAt: -1 } },
                        { $skip: skipPage },
                        { $limit: 6 }
                    ]).exec();
                } else {
                    products = await productModel.find({ adminId }).skip(skipPage).limit(parPage).sort({ createdAt: -1 });
                }

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


    // delete_product
    delete_product = async (req, res) => {
        const { pId } = req.params;
        try {

            const checkProduct = await cartModel.findOne({ productId: pId });

            if (checkProduct) {
                responseReturn(res, 400, { error: "Can't delete this product is in cart" });
            } else {
                const { productImage } = await productModel.findById(pId);
                await productModel.findByIdAndDelete(pId);
                productDeleteFunction(productImage)
                responseReturn(res, 200, {
                    message: "Product delete successfully"
                });
            }

        } catch (error) {
            responseReturn(res, 500, { error: "Internal server error" })
        }
    }

    // edit_product
    edit_product = async (req, res) => {
        const { pId } = req.params;
        try {
            const editProduct = await productModel.findById(pId);
            responseReturn(res, 200, { editProduct })
        } catch (error) {
            responseReturn(res, 500, { error: "Internal server error" })
        }
    }


    // update_product
    update_product = async (req, res) => {
        const { product, price, category, id, oldImage } = req.body;
        const productImage = req.file ? req.file.filename : oldImage;

        try {
            await productModel.findByIdAndUpdate(id, {
                product,
                price,
                category,
                productImage
            }, { new: true });

            productImgMoveFunc();
            if (req.file) {
                productDeleteFunction(oldImage);
            }
            responseReturn(res, 200, { message: "Product update successfully" })

        } catch (error) {
            responseReturn(res, 500, { error: "Internal server error" })
        }
    }

}


module.exports = new productController();
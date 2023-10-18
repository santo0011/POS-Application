
const invoiceModel = require('../../models/invoiceModel');
const cartModel = require('../../models/cartModel');
const { responseReturn } = require('../../utiles/response');
const { mongo: { ObjectId } } = require('mongoose');
const moment = require('moment');




class invoiceController {

    // create_invoice
    create_invoice = async (req, res) => {
        const { email, totilePrice, customerName, mobileNum, cart_products, card_product_count } = req.body;
        const { adminId } = req;

        let buyProducts = [];
        const tempDate = moment(Date.now()).format('LLL');


        for (let i = 0; i < cart_products.length; i++) {
            const pro = cart_products[i].products;
            const qty = cart_products[i].quantity

            for (let j = 0; j < pro.length; j++) {
                let tempProduct = { ...pro[j], qty };
                buyProducts.push(tempProduct)
            }

        }

        try {
            await invoiceModel.create({
                adminId,
                email,
                totilePrice,
                customerName,
                mobileNum,
                products: buyProducts,
                totalProduct: card_product_count,
                date: tempDate
            });

            await cartModel.deleteMany({ userId: adminId })
            responseReturn(res, 200, { message: "Create your invoice" })

        } catch (error) {
            responseReturn(res, 500, "Server error")
        }
    }


    // get_all_invoice
    get_all_invoice = async (req, res) => {
        const { adminId } = req;
        const { searchValue, page, parPage } = req.query;
        const skipPage = parseInt(parPage) * (parseInt(page) - 1);

        try {

            if (searchValue) {
                const allInvoice = await invoiceModel.find({
                    adminId: adminId,
                    $or: [
                        { customerName: { $regex: searchValue, $options: 'i' } },
                        { mobileNum: { $regex: searchValue, $options: 'i' } },
                        {
                            $expr: {
                                $regexMatch: {
                                    input: { $toString: "$totilePrice" },
                                    regex: searchValue,
                                    options: "i"
                                }
                            }
                        },
                        {
                            $expr: {
                                $regexMatch: {
                                    input: { $toString: "$_id" },
                                    regex: searchValue,
                                    options: "i"
                                }
                            }
                        }
                    ]
                }).sort({ createdAt: -1 });

                const invoiceCount = await invoiceModel.find({ adminId }).countDocuments();

                responseReturn(res, 200, {
                    allInvoice,
                    invoiceCount
                })


            } else {

                const allInvoice = await invoiceModel.find({ adminId }).skip(skipPage).limit(parPage).sort({ createdAt: -1 });
                const invoiceCount = await invoiceModel.find({ adminId }).countDocuments();
                responseReturn(res, 200, {
                    allInvoice,
                    invoiceCount
                })

            }

        } catch (error) {
            responseReturn(res, 500, "Server error")
        }

    }

}


module.exports = new invoiceController();
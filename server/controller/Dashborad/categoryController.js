const categoryModel = require('../../models/categoryModel');
const { categoryImgMoveFunc, categoryDeleteFunction } = require('../../utiles/imageFile');
const { responseReturn } = require('../../utiles/response');


class categoryController {

    // add_category
    add_category = async (req, res) => {
        const { adminId } = req;
        const categoryImage = req.file.filename;
        const { categoryName } = req.body;

        if (!adminId || !categoryName || !categoryName) {
            responseReturn(res, 404, { error: "All field is reqired !" })
        } else {
            try {
                const categorySlug = categoryName.trim().split(' ').join('-');
                const checkCategory = await categoryModel.findOne({ categorySlug });

                if (checkCategory) {
                    categoryDeleteFunction(categoryImage);
                    responseReturn(res, 404, { error: "Category already added" });
                } else {
                    await categoryModel.create({
                        adminId,
                        categoryName: categoryName.trim(),
                        categorySlug,
                        categoryImage
                    });
                    categoryImgMoveFunc();
                    responseReturn(res, 200, { message: "Category add successfull" });
                }

            } catch (error) {
                responseReturn(res, 500, "Server error")
            }

        }
    }


    // category_get
    category_get = async (req, res) => {
        const { adminId } = req;
        const { searchValue, page, parPage } = req.query;
        const skipPage = parseInt(parPage) * (parseInt(page) - 1);

        try {

            if (searchValue) {
                const categorys = await categoryModel.find({ adminId: adminId, categoryName: { $regex: searchValue, $options: 'i' } }).sort({ createdAt: -1 });
                const categoryCount = await categoryModel.find({adminId}).countDocuments();
                responseReturn(res, 200, {
                    allCategory: categorys,
                    categoryCount
                });

            } else {
                const categorys = await categoryModel.find({ adminId }).skip(skipPage).limit(parPage).sort({ createdAt: -1 });
                const categoryCount = await categoryModel.find({adminId}).countDocuments();
                responseReturn(res, 200, {
                    allCategory: categorys,
                    categoryCount
                })
            }

        } catch (error) {
            responseReturn(res, 500, "Server error")
        }
    }

}


module.exports = new categoryController();
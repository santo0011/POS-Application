const categoryModel = require('../../models/categoryModel');
const { categoryImgMoveFunc, categoryDeleteFunction, tempImageRemove } = require('../../utiles/imageFile');
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
                    tempImageRemove(categoryImage);
                    responseReturn(res, 404, { error: "Category already added" });
                } else {
                    const category = await categoryModel.create({
                        adminId,
                        categoryName: categoryName.trim(),
                        categorySlug,
                        categoryImage
                    });
                    categoryImgMoveFunc();
                    responseReturn(res, 200, { category, message: "Category add successfull" });
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
                const categoryCount = await categoryModel.find({ adminId }).countDocuments();
                responseReturn(res, 200, {
                    allCategory: categorys,
                    categoryCount
                });

            } else {
                const categorys = await categoryModel.find({ adminId }).skip(skipPage).limit(parPage).sort({ createdAt: -1 });
                const categoryCount = await categoryModel.find({ adminId }).countDocuments();
                responseReturn(res, 200, {
                    allCategory: categorys,
                    categoryCount
                })
            }

        } catch (error) {
            responseReturn(res, 500, "Server error")
        }
    }


    // category_delete
    category_delete = async (req, res) => {
        const { categoryId } = req.params;
        try {
            const { categoryImage } = await categoryModel.findById(categoryId);

            if (categoryImage) {
                categoryDeleteFunction(categoryImage)
                await categoryModel.findByIdAndDelete(categoryId);
                responseReturn(res, 200, {
                    message: "Category delete success"
                });
            }

        } catch (error) {
            responseReturn(res, 500, "Server error")
        }
    }


    // category_edit
    category_edit = async (req, res) => {
        const { cateSlug } = req.params;
        try {
            const editCategory = await categoryModel.findById(cateSlug);
            responseReturn(res, 200, { editCategory })
        } catch (error) {
            console.log(error.message)
        }
    }


    // category_update
    category_update = async (req, res) => {
        const categoryImage = req.file && req.file.filename;
        const { categoryName, id } = req.body;
        const categorySlug = categoryName.trim().split(' ').join('-');

        try {

            if (categoryImage === undefined) {
                await categoryModel.findByIdAndUpdate(id, {
                    categoryName,
                    categorySlug
                }, { new: true });
                responseReturn(res, 201, { message: "Category update success" })
            } else {
                const getCate = await categoryModel.findById(id);
                await categoryModel.findByIdAndUpdate(getCate._id.toHexString(), {
                    categoryName,
                    categorySlug,
                    categoryImage
                });
                categoryDeleteFunction(getCate.categoryImage)
                categoryImgMoveFunc();
                responseReturn(res, 201, { message: "Category update success" })

            }

        } catch (error) {
            console.log(error.message)
        }
    }

}


module.exports = new categoryController();
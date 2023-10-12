
const { responseReturn } = require('../../utiles/response');
const formidable = require('formidable');
const validator = require('validator');
const cloudinary = require('cloudinary').v2
const articleModel = require('../../models/articleModel');


class articalController {

    // add_artical
    add_artical = async (req, res) => {
        const { adminId, adminName } = req;

        const form = formidable()
        form.parse(req, async (err, fields, fiels) => {
            if (err) {
                responseReturn(res, 404, { error: "Something error" })
            } else {
                const { title, category, tag, slug, text } = fields;
                const { image } = fiels;

                if (!title || !category || !tag || !slug || !text || !image) {
                    responseReturn(res, 400, { error: "All field is required" })
                } else {
                    cloudinary.config({
                        cloud_name: process.env.cloud_name,
                        api_key: process.env.api_key,
                        api_secret: process.env.api_secret,
                        secure: true
                    });

                    try {
                        const result = await cloudinary.uploader.upload(image.filepath, { folder: "articalImg" });

                        const categoryName = category.split('-').join(' ');
                        const tagName = tag.split('-').join(' ');

                        await articleModel.create({
                            adminId,
                            adminName,
                            title,
                            slug,
                            category: categoryName,
                            category_slug: category,
                            tag: tagName,
                            tag_slug: tag,
                            articleText: text,
                            image: result.url
                        });
                        responseReturn(res, 201, { message: 'Article add successfull' })

                    } catch (error) {
                        responseReturn(res, 500, { error: error.message })
                    }

                }

            }
        })
    }


    // get_artical
    get_artical = async (req, res) => {
        const { role, adminId } = req;
        const { searchValue, page, parPage } = req.query;
        const skipPage = parseInt(parPage) * (parseInt(page) - 1);


        let articals = [];

        try {
            let articleCount = 0;

            if (searchValue) {
                if (role === 'admin') {
                    articals = await articleModel.find({
                        $or: [
                            { title: { $regex: searchValue, $options: 'i' } },
                            { articleText: { $regex: searchValue, $options: 'i' } }
                        ]
                    }).sort({ createdAt: -1 });
                    articleCount = await articleModel.find({}).countDocuments();
                } else {
                    articals = await articleModel.find({
                        adminId: adminId,
                        $or: [
                            { title: { $regex: searchValue, $options: 'i' } },
                            { articleText: { $regex: searchValue, $options: 'i' } }
                        ]
                    }).sort({ createdAt: -1 });
                    articleCount = await articleModel.find({ adminId }).countDocuments();
                }
            } else {
                if (role === 'admin') {
                    articals = await articleModel.find({}).skip(skipPage).limit(parPage).sort({ createdAt: -1 });
                    articleCount = await articleModel.find({}).countDocuments();
                } else {
                    articals = await articleModel.find({ adminId: adminId }).skip(skipPage).limit(parPage).sort({ createdAt: -1 });
                    articleCount = await articleModel.find({ adminId }).countDocuments();
                }
            }

            responseReturn(res, 200, {
                allArticle: articals,
                articleCount
            });

        } catch (error) {
            console.log(error.message)
        }
    }


    // edit_artical
    edit_artical = async (req, res) => {
        const { articleSlug } = req.params;
        const { role, adminId } = req;

        try {
            const getArticle = await articleModel.findOne({ slug: articleSlug });

            if (getArticle && getArticle.adminId === adminId || getArticle.role === role) {
                responseReturn(res, 200, { editArticle: getArticle })
            } else {
                responseReturn(res, 404, { error: "You can not edit this article" })
            }

        } catch (error) {
            console.log(error.message)
        }
    }


    // update_artical
    update_artical = async (req, res) => {
        const { adminId, role } = req;

        const form = formidable()
        form.parse(req, async (err, fields, fiels) => {
            if (err) {
                responseReturn(res, 404, { error: "Something error" })
            } else {
                const { title, category, tag, slug, text, articleId, oldImage } = fields;
                const { image } = fiels;

                if (!title || !category || !tag || !slug || !text) {
                    responseReturn(res, 400, { error: "All field is required" })
                } else {
                    try {
                        cloudinary.config({
                            cloud_name: process.env.cloud_name,
                            api_key: process.env.api_key,
                            api_secret: process.env.api_secret,
                            secure: true
                        });

                        let value_img = image ? await cloudinary.uploader.upload(image.filepath, { folder: "articalImg" }) : oldImage
                        let result_url = value_img.url ? value_img.url : value_img;


                        const getArticle = await articleModel.findById(articleId);

                        if (getArticle && getArticle.adminId === adminId || getArticle.role === role) {

                            const categoryName = category.split('-').join(' ');
                            const tagName = tag.split('-').join(' ');

                            await articleModel.findByIdAndUpdate(articleId, {
                                title: title.trim(),
                                slug: slug.trim(),
                                category: categoryName,
                                category_slug: category,
                                tag: tagName,
                                tag_slug: tag,
                                articleText: text,
                                image: result_url
                            }, { new: true });


                            const parts = oldImage.split('/');
                            const publicId = parts[parts.length - 1].split('.')[0];

                            const deleteResult = image ? await cloudinary.uploader.destroy(publicId) : ""
                            console.log('Old image deleted successfully:', deleteResult);

                            responseReturn(res, 200, { message: "Article successfully update" })

                        } else {
                            responseReturn(res, 404, { error: "You can not edit this article" })
                        }

                    } catch (error) {
                        console.log(error.message)
                    }
                }

            }
        })
    }


    // delete_artical
    delete_artical = async (req, res) => {
        const { articleId } = req.params;
        const { adminId, role } = req;
        try {
            const getArticle = await articleModel.findById(articleId);
            if (getArticle && getArticle.adminId === adminId || getArticle.role === role) {
                await articleModel.findByIdAndDelete(articleId);
                responseReturn(res, 200, { message: "Article delete successfullly" })
            } else {
                responseReturn(res, 404, { error: "You can not delete this article" })
            }
        } catch (error) {
            console.log(error.message)
        }
    }

}


module.exports = new articalController();
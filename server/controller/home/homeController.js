const { responseReturn } = require('../../utiles/response');
const articleModel = require('../../models/articleModel');


class homeController {

    //  get_all_category
    get_all_category = async (req, res) => {
        const { searchValue, page, parPage } = req.query;
        const skipPage = parseInt(parPage) * (parseInt(page) - 1);

        let homeArticle = [];

        try {
            const countArticle = await articleModel.find({}).countDocuments();

            if (searchValue) {

            } else {
                homeArticle = await articleModel.find({}).skip(skipPage).limit(parPage).sort({ createAt: -1 });
            }

            responseReturn(res, 200, {
                homeArticle,
                countArticle
            });

        } catch (error) {
            responseReturn(res, 500, { error: "Server error" })
        }
    }

    // home_tag_category_get
    home_tag_category_get = async (req, res) => {
        try {
            const homeCategory = await articleModel.aggregate([
                {
                    $match: {
                        category: {
                            $not: {
                                $size: 0
                            }
                        }
                    },
                },
                {
                    $unwind: "$category"
                },
                {
                    $group: {
                        _id: "$category",
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]);

            const homeTag = await articleModel.distinct('tag')
            responseReturn(res, 200, {
                homeCategory,
                homeTag
            })

        } catch (error) {
            responseReturn(res, 500, { error: "Server error" })
        }
    }


    // old_react_article
    old_react_article = async (req, res) => {
        try {
            const oldArticle = await articleModel.aggregate([
                {
                    $match: {}
                },
                {
                    $sample: {
                        size: 3
                    }
                }
            ]);

            const recentArticle = await articleModel.find({}).limit(3).sort({
                createdAt: -1
            });
            responseReturn(res, 200, {
                oldArticle,
                recentArticle
            });

        } catch (error) {
            console.log(error.mesasge)
        }
    }

}

module.exports = new homeController();
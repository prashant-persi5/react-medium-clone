const Article = require("../modals/articleModal");

const getTagsAction = async (req, res) => {
  try {
    let tags = [];

    const articlesList = await Article.find({}, { tagList: true, _id: false });

    articlesList.forEach((article) => {
      tags.push(...article.tagList);
    });

    tags = [...new Set([...tags])];

    return res.status(200).json({
      status: "success",
      message: "Tags fetched successfully",
      tags,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Failed to get tags",
    });
  }
};

module.exports = {
  getTagsAction,
};

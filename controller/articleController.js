const Article = require("../modals/articleModal");
const User = require("../modals/userModal");

const getArticles = async ({
  currentUser,
  author,
  favorited,
  followed,
  limit,
  offset,
  tag,
}) => {
  const filter = {};
  if (author) {
    const authorDetails = await User.findOne(
      { username: author },
      { _id: true }
    );
    filter.createdBy = authorDetails._id;
  } else if (favorited) {
    const authorDetails = await User.findOne(
      { username: favorited },
      { _id: true, favoritedArticles: true }
    );
    filter._id = { $in: authorDetails.favoritedArticles };
  } else if (followed) {
    filter.createdBy = { $in: followed };
  } else if (tag) {
    filter.tagList = { $in: tag };
  }

  let articlesList = await Article.find(filter, null, {
    limit,
    skip: offset,
  }).populate({
    path: "createdBy",
    select: "_id username email image",
  });

  const articles = articlesList.map((article) => {
    let currentArticle = article.toObject();
    if (currentUser) {
      currentArticle.favorited = currentUser.favoritedArticles.includes(
        currentArticle._id
      );
    }
    return currentArticle;
  });

  return articles;
};

const getArticlesAction = async (req, res) => {
  try {
    const { limit, offset, author, favorited, tag } = req.query;
    let currentUser = null;

    if (req.currentUser && req.currentUser._id) {
      currentUser = await User.findById(req.currentUser._id);
    }

    const count = await Article.count();
    const articles = await getArticles({
      currentUser,
      author,
      favorited,
      limit,
      offset,
      tag,
    });

    return res.status(200).json({
      status: "success",
      message: "Articles fetched successfully",
      count,
      articles,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Failed to get articles",
    });
  }
};

const getArticleFeed = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    let currentUser = null;

    if (req.currentUser && req.currentUser._id) {
      currentUser = await User.findById(req.currentUser._id);
    }

    const count = await Article.count();
    const followedUsers = await User.find(
      {
        following: { $elemMatch: { $eq: req.currentUser._id } },
      },
      { _id: true }
    );

    const articles = await getArticles({
      currentUser,
      limit,
      offset,
      followed: followedUsers,
    });

    return res.status(200).json({
      status: "success",
      message: "Articles fetched successfully",
      count,
      articles,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Failed to get articles",
    });
  }
};

const createAction = async (req, res) => {
  try {
    const body = req.body;
    const slug = body.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const article = new Article({
      title: body.title,
      slug,
      description: body.description,
      body: body.body,
      tagList: body.tagList,
      createdBy: req.currentUser,
    });
    await article.save();

    return res.status(201).json({
      status: "success",
      message: "Article created successfully",
      data: article,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Failed to create article",
    });
  }
};

const addToFavoriteAction = async (req, res) => {
  const userId = req.currentUser._id;
  const article = req.params.id;

  try {
    let result = null;
    const isExists = await User.find({
      _id: userId,
      favoritedArticles: { $elemMatch: { $eq: article } },
    });

    if (!isExists.length) {
      result = await Article.findOneAndUpdate(
        { _id: article },
        { $inc: { favoritesCount: 1 } },
        { new: true }
      );

      if (result) {
        await User.findOneAndUpdate(
          { _id: userId },
          { $push: { favoritedArticles: article } },
          { new: true }
        );
      }
    } else {
      result = true;
    }

    if (result) {
      return res.status(200).json({
        status: "success",
        message: "Article favorited successfully",
        article: {
          ...result.toObject(),
          favorited: true,
        },
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Failed to favorite the article",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Failed to favorite the article",
    });
  }
};

const removeFromFavoriteAction = async (req, res) => {
  const userId = req.currentUser._id;
  const article = req.params.id;

  try {
    let result = null;
    result = await Article.findOneAndUpdate(
      { _id: article },
      { $inc: { favoritesCount: -1 } },
      { new: true }
    );

    if (result) {
      await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { favoritedArticles: article } },
        { new: true }
      );
    }

    if (result) {
      return res.status(200).json({
        status: "success",
        message: "Article unfavorited successfully",
        article: {
          ...result.toObject(),
          favorited: false,
        },
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Failed to unfavorite the article",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Failed to unfavorite the article",
    });
  }
};

const getSingleArticlesAction = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug }).populate({
      path: "createdBy",
      select: "_id username email image",
    });

    return res.status(200).json({
      status: "success",
      message: "Article fetched successfully",
      article,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Failed to get article",
    });
  }
};

const deleteArticleAction = async (req, res) => {
  try {
    const userId = req.currentUser._id;
    const articleId = req.params.id;

    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { favoritedArticles: articleId } },
      { new: true }
    );

    const deleted = await Article.deleteOne({ _id: articleId });

    return res.status(200).json({
      status: "success",
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete article",
    });
  }
};

const updateArticleAction = async (req, res) => {
  try {
    const body = req.body;
    const articleSlug = req.params.slug;
    const slug = body.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const article = await Article.findOneAndUpdate(
      { slug: articleSlug },
      {
        title: body.title,
        slug,
        description: body.description,
        body: body.body,
        tagList: body.tagList,
      },
      { new: true }
    );

    return res.status(201).json({
      status: "success",
      message: "Article updated successfully",
      data: article,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Failed to update article",
    });
  }
};

module.exports = {
  getArticlesAction,
  getArticleFeed,
  createAction,
  addToFavoriteAction,
  removeFromFavoriteAction,
  getSingleArticlesAction,
  deleteArticleAction,
  updateArticleAction,
};

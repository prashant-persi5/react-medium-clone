const Article = require("../modals/articleModal");
const Comment = require("../modals/commentModal");

const createCommentAction = async (req, res) => {
  try {
    const body = req.body.comment.body;
    const article = await Article.findOne({ slug: req.params.slug });

    if (article) {
      const newComment = new Comment({
        body,
        article: article._id,
        createdBy: req.currentUser,
      });

      await newComment.save();

      return res.status(201).json({
        status: "success",
        message: "Comment created successfully",
        data: newComment,
        // data: {
        //   body: newComment.body,
        //   createdAt: newComment.createdAt,
        //   updatedAt: newComment.updatedAt,
        //   id: newComment._id,
        //   slug: article.slug,
        //   articleId: article._id,
        // },
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Article not found to create comment",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Failed to create comment",
    });
  }
};

const getComments = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });

    if (article) {
      const comments = await Comment.find({ article: article._id }).populate({
        path: "createdBy",
        select: "_id username email image",
      });
      return res.status(200).json({
        status: "success",
        message: "Comment fetched successfully",
        comments,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Article not found for comments",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Failed to get comments",
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const article = await Article.findOne({ slug: req.params.slug });

    if (article) {
      const deleted = await Comment.deleteOne({ _id: commentId });
      return res.status(200).json({
        status: "success",
        message: "Comment deleted successfully",
        deleted,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Article not found to delete comment",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete comment",
    });
  }
};

module.exports = {
  createCommentAction,
  getComments,
  deleteComment,
};

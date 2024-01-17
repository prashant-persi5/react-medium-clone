const router = require("express").Router();
const {
  getArticlesAction,
  getArticleFeed,
  createAction,
  getSingleArticlesAction,
  addToFavoriteAction,
  removeFromFavoriteAction,
  deleteArticleAction,
  updateArticleAction,
} = require("../controller/articleController");
const {
  createCommentAction,
  getComments,
  deleteComment,
} = require("../controller/commentController");
const { authCheck, currentUser } = require("../middlewares/auth");

router.get("/", currentUser, getArticlesAction);
router.post("/", authCheck, createAction);
router.get("/feed", authCheck, getArticleFeed);
router.get("/:slug", getSingleArticlesAction);
router.put("/:slug", authCheck, updateArticleAction);
router.post("/:id/favorite", authCheck, addToFavoriteAction);
router.post("/:id/unfavorite", authCheck, removeFromFavoriteAction);
router.delete("/:id", authCheck, deleteArticleAction);

//comments routes
router.post("/:slug/comment", authCheck, createCommentAction);
router.get("/:slug/comment", authCheck, getComments);
router.delete("/:slug/comment/:commentId", authCheck, deleteComment);
module.exports = router;

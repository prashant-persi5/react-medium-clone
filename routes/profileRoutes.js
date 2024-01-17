const router = require("express").Router();
const {
  getProfileAction,
  followUserAction,
  unFollowUserAction,
} = require("../controller/profileController");
const { authCheck, currentUser } = require("../middlewares/auth");

router.get("/:username", currentUser, getProfileAction);
router.post("/:username/follow", authCheck, followUserAction);
router.delete("/:username/follow", authCheck, unFollowUserAction);

module.exports = router;

const { getTagsAction } = require("../controller/tagsController");

const router = require("express").Router();

router.get("/", getTagsAction);

module.exports = router;

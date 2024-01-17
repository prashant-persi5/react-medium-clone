const router = require("express").Router();
const {
  currentAction,
  loginAction,
  registerAction,
  updateAction,
} = require("../controller/userController");
const { authCheck } = require("../middlewares/auth");

router.get("/current", authCheck, currentAction);

router.post("/login", loginAction);

router.post("/register", registerAction);

router.put("/update", authCheck, updateAction);

module.exports = router;

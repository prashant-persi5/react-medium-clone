const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../modals/userModal");

const currentAction = async (req, res) => {
  try {
    const reqUser = req.currentUser;
    if (!reqUser) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized: No user",
      });
    }

    const user = await User.findById(reqUser._id);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized: Invalid user",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "validated user",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Unauthorized: Unable to validate user",
    });
  }
};

const loginAction = async (req, res) => {
  try {
    const body = req.body;
    const user = await User.findOne({
      email: body.email,
    });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Login Failed: Invalid email",
      });
    }

    const match = await bcrypt.compare(body.password, user.password);
    if (!match) {
      return res.status(400).json({
        status: "error",
        message: "Login Failed: Invalid password",
      });
    }

    const result = {
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      image: user.image,
    };

    const token = jwt.sign(result, process.env.JWT_SECRET_KEY);

    return res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      user: { ...result, token },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Login Failed: Unable to login",
    });
  }
};

const registerAction = async (req, res) => {
  const saltRounds = 10;
  try {
    const body = req.body;
    body.password = await bcrypt.hash(body.password, saltRounds);

    const user = new User(body);
    await user.save();

    const result = {
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      image: user.image,
    };

    const token = jwt.sign(result, process.env.JWT_SECRET_KEY);

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      user: { ...result, token },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Validation failed: Failed to create user",
    });
  }
};

const updateAction = async (req, res) => {
  try {
    const body = req.body;
    const reqUser = req.currentUser;

    let password = "";
    if (body.password) {
      password = await bcrypt.hash(body.password, saltRounds);
      const saltRounds = 10;
    }

    const updateData = {
      username: body.username,
      email: body.email,
      image: body.image,
      bio: body.bio,
    };

    if (password) {
      updateData.password = password;
    }

    const user = await User.findByIdAndUpdate(reqUser._id, updateData, {
      runValidators: true,
      new: true,
    });

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      user: updateData,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Failed to update user",
    });
  }
};

module.exports = {
  currentAction,
  loginAction,
  registerAction,
  updateAction,
};

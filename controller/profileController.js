const User = require("../modals/userModal");

const getProfileAction = async (req, res) => {
  try {
    const currentUser = req.currentUser;
    const requestedUser = req.params.username;
    const user = await User.findOne({ username: requestedUser });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found",
      });
    }

    const isFollowing =
      currentUser && currentUser._id
        ? user.following.includes(currentUser._id)
        : false;

    return res.status(200).json({
      status: "success",
      message: "User profile found",
      profile: {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        bio: user.bio,
        isFollowing,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Unable to find user",
    });
  }
};

const followUserAction = async (req, res) => {
  try {
    let result = null;
    const currentUser = req.currentUser;
    const requestedUser = req.params.username;
    const user = await User.findOne({ username: requestedUser });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    const isExists = await User.find({
      _id: user._id,
      following: { $elemMatch: { $eq: currentUser._id } },
    });

    if (!isExists.length) {
      result = await User.findOneAndUpdate(
        { _id: user._id },
        { $push: { following: currentUser._id } },
        { new: true }
      );
    } else {
      result = true;
    }

    if (result) {
      return res.status(200).json({
        status: "success",
        message: "User followed successfully",
        profile: {
          ...result.toObject(),
          isFollowing: true,
        },
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Failed to follow user",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Unable to follow user",
    });
  }
};

const unFollowUserAction = async (req, res) => {
  try {
    const currentUser = req.currentUser;
    const requestedUser = req.params.username;
    const user = await User.findOne({ username: requestedUser });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { following: currentUser._id } },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      message: "User unfollowed successfully",
      profile: {
        ...user.toObject(),
        isFollowing: false,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Unable to unfollow user",
    });
  }
};

module.exports = {
  getProfileAction,
  followUserAction,
  unFollowUserAction,
};

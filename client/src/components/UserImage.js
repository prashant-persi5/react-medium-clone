import React from "react";

const UserImage = ({ image, className, username }) => {
  const imageUrl = image ? image : "/images/user-default.jpg";
  const clsName = className ? className : "user-pic";

  return <img src={imageUrl} className={clsName} alt={username} />;
};

export default UserImage;

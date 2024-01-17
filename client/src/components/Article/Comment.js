import React from "react";
import { Link } from "react-router-dom";
import UserImage from "../UserImage";
import DeleteButton from "./DeleteButton";

const Comment = (props) => {
  console.log(props.currentUser);
  const comment = props.comment;
  const show =
    props.currentUser && props.currentUser._id === comment.createdBy._id;

  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link to={`/@${comment.createdBy.username}`}>
          <UserImage
            image={comment.createdBy.image}
            username={comment.createdBy.username}
            className="comment-author-img"
          />
        </Link>
        &nbsp;
        <Link to={`/@${comment.createdBy.username}`} className="comment-author">
          {comment.createdBy.username}
        </Link>
        <span className="date-posted">
          {new Date(comment.createdAt).toDateString()}
        </span>
        <DeleteButton show={show} slug={props.slug} commentId={comment._id} />
      </div>
    </div>
  );
};

export default Comment;

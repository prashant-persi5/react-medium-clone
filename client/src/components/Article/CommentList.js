import React from "react";
import Comment from "./Comment";

const CommentList = (props) => {
  return (
    <div class="comment-list">
      {props.comments.map((comment) => {
        return (
          <Comment
            comment={comment}
            currentUser={props.currentUser}
            slug={props.slug}
            key={comment._id}
          />
        );
      })}
    </div>
  );
};

export default CommentList;

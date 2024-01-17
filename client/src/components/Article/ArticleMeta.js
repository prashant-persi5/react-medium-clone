import React from "react";
import { Link } from "react-router-dom";
import UserImage from "../UserImage";
import ArticleActions from "./ArticleActions";

const ArticleMeta = (props) => {
  const article = props.article;

  return (
    <div className="article-meta">
      <Link to={`/@${article.createdBy.username}`}>
        <UserImage
          image={article.createdBy.image}
          username={article.createdBy.username}
        />
      </Link>

      <div className="info">
        <Link to={`/@${article.createdBy.username}`} className="author">
          {article.createdBy.username}
        </Link>
        <span className="date">
          {new Date(article.createdAt).toDateString()}
        </span>
      </div>

      <ArticleActions canModify={props.canModify} article={article} />
    </div>
  );
};

export default ArticleMeta;

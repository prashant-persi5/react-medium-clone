import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import agent from "../agent";
import {
  ARTICLE_FAVORITED,
  ARTICLE_UNFAVORITED,
} from "../constants/actionTypes";
import UserImage from "./UserImage";

const FAVORITED_CLASS = "btn btn-sm btn-primary";
const NOT_FAVORITED_CLASS = "btn btn-sm-btn-outline-primary";

const mapDispatchToProps = (dispatch) => ({
  favorite: (id) =>
    dispatch({
      type: ARTICLE_FAVORITED,
      payload: agent.Article.favorite(id),
    }),
  unfavorite: (id) =>
    dispatch({
      type: ARTICLE_UNFAVORITED,
      payload: agent.Article.unfavorite(id),
    }),
});

const ArticlePreview = (props) => {
  const article = props.article;
  const favoriteButtonClass = article.favorited
    ? FAVORITED_CLASS
    : NOT_FAVORITED_CLASS;

  const handleClick = (ev) => {
    ev.preventDefault();
    if (article.favorited) {
      props.unfavorite(article._id);
    } else {
      props.favorite(article._id);
    }
  };

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`/@${article.createdBy.username}`}>
          <UserImage
            image={article.createdBy.image}
            username={article.createdBy.username}
          />
        </Link>
        <div className="info">
          <Link className="author" to={`/@${article.createdBy.username}`}>
            {article.createdBy.username}
          </Link>
          <span className="date">
            {new Date(article.createdAt).toDateString()}
          </span>
        </div>

        <div className="pull-xs-right">
          <button className={favoriteButtonClass} onClick={handleClick}>
            <i className="ion-heart"></i> {article.favoritesCount}
          </button>
        </div>
      </div>

      <Link to={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map((tag) => {
            return (
              <li className="tag-default tag-pill tag-outline" key={tag}>
                {tag}
              </li>
            );
          })}
        </ul>
      </Link>
    </div>
  );
};

export default connect(() => ({}), mapDispatchToProps)(ArticlePreview);

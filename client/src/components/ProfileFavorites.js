import React from "react";
import { Profile, mapStateToProps } from "./Profile";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import agent from "../agent";
import {
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED,
} from "../constants/actionTypes";

const mapDispatchToProps = (dispatch) => ({
  onLoad: (pager, payload) =>
    dispatch({ type: PROFILE_PAGE_LOADED, pager, payload }),
  onUnload: () => dispatch({ type: PROFILE_PAGE_UNLOADED }),
});

class ProfileFavorites extends Profile {
  componentDidMount() {
    console.log("HERE");
    this.props.onLoad(
      (page) =>
        agent.Article.favoritedBy(this.props.match.params.username, page),
      Promise.all([
        agent.Profile.get(this.props.match.params.username),
        agent.Article.favoritedBy(this.props.match.params.username),
      ])
    );
  }

  componentWillMount() {
    this.props.onUnload();
  }

  renderTabs() {
    console.log(this.props);
    return (
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <Link className="nav-link" to={`/@${this.props.profile.username}`}>
            My Articles
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to={`/@${this.props.profile.username}`}
            className="nav-link active"
          >
            Favorited Articles
          </Link>
        </li>
      </ul>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileFavorites);

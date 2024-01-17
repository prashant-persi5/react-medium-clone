import superagentPromise from "superagent-promise";
import _superagent from "superagent";
import { ARTICLES_PER_PAGE } from "./constants/constants";

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = "http://localhost:8081/v1";

const encode = encodeURIComponent;
const responseBody = (res) => res.body;

let token = null;
const tokenPlugin = (req) => {
  if (token) {
    req.set("authorization", `Token ${token}`);
  }
};

const requests = {
  del: (url) =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: (url) =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .then(responseBody),
};

const Auth = {
  current: () => requests.get("/auth/current"),
  login: (email, password) => requests.post("/auth/login", { email, password }),
  register: (username, email, password) =>
    requests.post("/auth/register", { username, email, password }),
  save: (user) => requests.put("/auth/update", { ...user }),
};

const Tags = {
  getAll: () => requests.get("/tags"),
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const Article = {
  all: (page) => requests.get(`/article?${limit(ARTICLES_PER_PAGE, page)}`),
  byAuthor: (author, page) =>
    requests.get(`/article?author=${encode(author)}&${limit(10, page)}`),
  byTag: (tag, page) =>
    requests.get(`/article?tag=${encode(tag)}&${limit(10, page)}`),
  del: (id) => requests.del(`/article/${id}`),
  favorite: (id) => requests.post(`/article/${id}/favorite`),
  favoritedBy: (author, page) =>
    requests.get(`/article?favorited=${encode(author)}&${limit(5, page)}`),
  feed: () => requests.get(`/article/feed?limit=10&offset=0`),
  get: (slug) => requests.get(`/article/${slug}`),
  unfavorite: (id) => requests.post(`/article/${id}/unfavorite`),
  update: (article, slug) => requests.put(`/article/${slug}`, { ...article }),
  create: (article) => requests.post("/article", { ...article }),
};

const Comments = {
  create: (slug, comment) =>
    requests.post(`/article/${slug}/comment`, { comment }),
  delete: (slug, commentId) =>
    requests.del(`/article/${slug}/comment/${commentId}`),
  get: (slug) => requests.get(`/article/${slug}/comment`),
};

const Profile = {
  follow: (username) => requests.post(`/profile/${username}/follow`),
  get: (username) => requests.get(`/profile/${username}`),
  unfollow: (username) => requests.del(`/profile/${username}/follow`),
};

export default {
  Article,
  Auth,
  Comments,
  Profile,
  Tags,
  setToken: (_token) => {
    token = _token;
  },
};

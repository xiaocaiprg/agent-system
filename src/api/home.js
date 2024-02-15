import http from "./index";

const PATH = {
  GET_USER_LIST: "haiyang/user/list",
  ADD_INTEGRAL: "haiyang/integral/add",
  GET_INTEGRAL_LIST: "/haiyang/integral",
};
const API = {
  getAll(params) {
    return http
      .get(PATH.GET_USER_LIST, params)
      .then(res => {
        if (res.code === 200) {
          return res.result;
        }
      })
      .catch(err => {
        throw err;
      });
  },
  addIntegral(params) {
    return http
      .post(`${PATH.ADD_INTEGRAL}`, params)
      .then(res => {
        if (res.code === 200) {
          return res.success;
        }
      })
      .catch(err => {
        throw err;
      });
  },
  getIntegral(params) {
    return http
      .get(PATH.GET_INTEGRAL_LIST, params)
      .then(res => {
        if (res.code === 200) {
          return res.result;
        }
      })
      .catch(err => {
        throw err;
      });
  },
};
export default API;
